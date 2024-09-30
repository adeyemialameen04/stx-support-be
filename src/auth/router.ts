import { Hono } from "hono";
import { sign, verify } from "jsonwebtoken";
import { loginSchema } from "./contract";
import { handleValidation } from "../utils/validation";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { eq } from "drizzle-orm";
import logger from "../utils/logger";
import {
  createAccessToken,
  generatePasswdHash,
  verifyPasswdHash,
} from "../utils/auth";
import { accessTokenMiddleware, authMiddleware } from "./middleware";

export const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  try {
    const data = await c.req.json();
    const credentials = loginSchema.parse(data);
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.stxAddressMainnet, credentials.stxAddressMainnet));
    logger.info(existingUser);

    if (!existingUser) {
      return c.json(
        {
          status_code: 404,
          detail: "User does not exist",
        },
        404,
      );
    }

    const isMatch = await verifyPasswdHash(
      credentials.password,
      existingUser.password_hash,
    );

    if (isMatch) {
      const {
        token: accessToken,
        expiryTimestamp: accessTokenExpiryTimestamp,
      } = await createAccessToken({
        stxAddressMainnet: existingUser.stxAddressMainnet as string,
        id: existingUser.id,
      });
      const {
        token: refreshToken,
        expiryTimestamp: refreshTokenExpiryTimestamp,
      } = await createAccessToken({
        stxAddressMainnet: existingUser.stxAddressMainnet as string,
        id: existingUser.id,
      });

      return c.json(
        {
          message: "Login successful",
          accessToken,
          refreshToken,
          accessTokenExpiryTimestamp,
          refreshTokenExpiryTimestamp,
          user: {
            id: existingUser.id,
            stxAddressMainnet: existingUser.stxAddressMainnet,
          },
        },
        200,
      );
    } else {
      return c.json({ status_code: 401, detail: "Invalid credentials" }, 401);
    }
  } catch (error) {
    return handleValidation(error, c);
  }
});

authRouter.post("/signup", async (c) => {
  try {
    const data = await c.req.json();
    const credentials = loginSchema.parse(data);
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.stxAddressMainnet, credentials.stxAddressMainnet));
    logger.info(existingUser);

    if (existingUser) {
      c.status(403);
      return c.json({
        status_code: 403,
        detail: "User with this email already exists\nGo and login",
      });
    }

    const hashedPasswd = await generatePasswdHash(credentials.password);
    logger.info(hashedPasswd);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        stxAddressMainnet: credentials.stxAddressMainnet,
        password_hash: hashedPasswd,
      })
      .returning();

    const { password_hash, ...userWithoutPassword } = newUser;

    return c.json(userWithoutPassword);
  } catch (err) {
    return handleValidation(err, c);
  }
});

authRouter.get("/refresh", async (c) => {
  const { refreshToken } = await c.req.json();
  try {
    const decoded = verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { username: string };
    const accessToken = sign(
      { username: decoded.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );
    return c.json({ accessToken });
  } catch (error) {
    c.status(401);
    return c.json({ error: "Invalid refresh token" });
  }
});

authRouter.get("/logout", accessTokenMiddleware, async (c) => {
  // Implement logout logic (e.g., invalidate refresh token)
  const user = c.get("user");
  console.log(JSON.stringify(user, null, 2));
  return c.json(
    {
      message: `Logged ${user.stxAddressMainnet} out successfully`,
    },
    200,
  );
});
