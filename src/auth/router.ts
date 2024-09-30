import { Hono } from "hono";
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
import {
  accessTokenMiddleware,
  refreshTokenMiddleware,
  validTokenMiddleware,
} from "./middleware";
import { addJtiRevoked } from "../db/redis";

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
      } = await createAccessToken(
        {
          stxAddressMainnet: existingUser.stxAddressMainnet as string,
          id: existingUser.id,
        },
        604800,
        true,
      );

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

authRouter.get(
  "/refresh",
  validTokenMiddleware,
  refreshTokenMiddleware,
  async (c) => {
    try {
      const payload = c.get("jwtPayload");
      const {
        token: accessToken,
        expiryTimestamp: accessTokenExpiryTimestamp,
      } = await createAccessToken({
        stxAddressMainnet: payload.user.stxAddressMainnet,
        id: payload.user.id,
      });

      return c.json({ accessToken, accessTokenExpiryTimestamp });
    } catch (error) {
      c.status(401);
      return c.json({ error: "Invalid refresh token" });
    }
  },
);

authRouter.get(
  "/logout",
  validTokenMiddleware,
  accessTokenMiddleware,
  async (c) => {
    const payload = c.get("jwtPayload");
    console.log(JSON.stringify(payload, null, 2));
    await addJtiRevoked(payload?.jti);
    return c.json(
      {
        message: `Logged ${payload.user.stxAddressMainnet} out successfully`,
      },
      200,
    );
  },
);
