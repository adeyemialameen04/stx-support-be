import { eq } from "drizzle-orm";
import {
  verifyPasswdHash,
  createAccessToken,
  generatePasswdHash,
} from "@/utils/auth";
import logger from "@/utils/logger";
import { db } from "@/db";
import { addJtiRevoked } from "@/db/redis";
import { AppRouteHandler } from "@/lib/types";
import { userTable } from "@/db/schema";
import { loginRoute, signupRoute, refreshRoute, logoutRoute } from "./routes";

export const loginHandler: AppRouteHandler<typeof loginRoute> = async (c) => {
  const { stxAddressMainnet, password } = c.req.valid("json");
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.stxAddressMainnet, stxAddressMainnet));
  logger.info(existingUser);

  if (!existingUser) {
    return c.json(
      {
        status: 401,
        detail: "Invalid username or password",
        error: "Unauthorized",
      },
      401,
    );
  }

  const isMatch = await verifyPasswdHash(password, existingUser.password_hash);

  if (isMatch) {
    const { token: accessToken, expiryTimestamp: accessTokenExpiryTimestamp } =
      await createAccessToken({
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
    return c.json(
      {
        status: 401,
        detail: "Invalid username or password",
        error: "Unauthorized",
      },
      401,
    );
  }
};

export const signupHandler: AppRouteHandler<typeof signupRoute> = async (c) => {
  const { stxAddressMainnet, password } = c.req.valid("json");
  const [existingUser] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.stxAddressMainnet, stxAddressMainnet));
  logger.info(existingUser);

  if (existingUser) {
    return c.json(
      {
        status: 409,
        detail: "Username already exists",
        error: "Conflict",
      },
      409,
    );
  }

  const hashedPasswd = await generatePasswdHash(password);
  logger.info(hashedPasswd);

  const [newUser] = await db
    .insert(userTable)
    .values({
      stxAddressMainnet: stxAddressMainnet,
      password_hash: hashedPasswd,
    })
    .returning();

  const { password_hash, ...userWithoutPassword } = newUser;

  return c.json(userWithoutPassword, 201);
};

export const refreshhandler: AppRouteHandler<typeof refreshRoute> = async (
  c,
) => {
  const payload = c.get("jwtPayload");
  const { token: accessToken, expiryTimestamp: accessTokenExpiryTimestamp } =
    await createAccessToken({
      stxAddressMainnet: payload.user.stxAddressMainnet,
      id: payload.user.id,
    });

  return c.json({ accessToken, accessTokenExpiryTimestamp });
};

export const logoutHandler: AppRouteHandler<typeof logoutRoute> = async (c) => {
  const payload = c.get("jwtPayload");
  console.log(JSON.stringify(payload, null, 2));
  await addJtiRevoked(payload?.jti);
  return c.json(
    {
      status: 200,
      detail: "Logout successful",
    },
    200,
  );
};

// authRouter.post("/login", async (c) => {
//   try {
//     const data = await c.req.json();
//     const credentials = loginSchema.parse(data);
//     const [existingUser] = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.stxAddressMainnet, credentials.stxAddressMainnet));
//     logger.info(existingUser);
//
//     if (!existingUser) {
//       return c.json(
//         {
//           status_code: 404,
//           detail: "User does not exist",
//         },
//         404,
//       );
//     }
//
//     const isMatch = await verifyPasswdHash(
//       credentials.password,
//       existingUser.password_hash,
//     );
//
//     if (isMatch) {
//       const {
//         token: accessToken,
//         expiryTimestamp: accessTokenExpiryTimestamp,
//       } = await createAccessToken({
//         stxAddressMainnet: existingUser.stxAddressMainnet as string,
//         id: existingUser.id,
//       });
//       const {
//         token: refreshToken,
//         expiryTimestamp: refreshTokenExpiryTimestamp,
//       } = await createAccessToken(
//         {
//           stxAddressMainnet: existingUser.stxAddressMainnet as string,
//           id: existingUser.id,
//         },
//         604800,
//         true,
//       );
//
//       return c.json(
//         {
//           message: "Login successful",
//           accessToken,
//           refreshToken,
//           accessTokenExpiryTimestamp,
//           refreshTokenExpiryTimestamp,
//           user: {
//             id: existingUser.id,
//             stxAddressMainnet: existingUser.stxAddressMainnet,
//           },
//         },
//         200,
//       );
//     } else {
//       return c.json({ status_code: 401, detail: "Invalid credentials" }, 401);
//     }
//   } catch (error) {
//     return handleValidation(error, c);
//   }
// });
//
// authRouter.post("/signup", async (c) => {
//   try {
//     const data = await c.req.json();
//     const credentials = loginSchema.parse(data);
//     const [existingUser] = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.stxAddressMainnet, credentials.stxAddressMainnet));
//     logger.info(existingUser);
//
//     if (existingUser) {
//       c.status(403);
//       return c.json({
//         status_code: 403,
//         detail: "User with this email already exists\nGo and login",
//       });
//     }
//
//     const hashedPasswd = await generatePasswdHash(credentials.password);
//     logger.info(hashedPasswd);
//
//     const [newUser] = await db
//       .insert(usersTable)
//       .values({
//         stxAddressMainnet: credentials.stxAddressMainnet,
//         password_hash: hashedPasswd,
//       })
//       .returning();
//
//     const { password_hash, ...userWithoutPassword } = newUser;
//
//     return c.json(userWithoutPassword);
//   } catch (err) {
//     return handleValidation(err, c);
//   }
// });
//
// authRouter.get(
//   "/refresh",
//   validTokenMiddleware,
//   refreshTokenMiddleware,
//   async (c) => {
//     try {
//       const payload = c.get("jwtPayload");
//       const {
//         token: accessToken,
//         expiryTimestamp: accessTokenExpiryTimestamp,
//       } = await createAccessToken({
//         stxAddressMainnet: payload.user.stxAddressMainnet,
//         id: payload.user.id,
//       });
//
//       return c.json({ accessToken, accessTokenExpiryTimestamp });
//     } catch (error) {
//       c.status(401);
//       return c.json({ error: "Invalid refresh token" });
//     }
//   },
// );
//
// authRouter.get(
//   "/logout",
//   validTokenMiddleware,
//   accessTokenMiddleware,
//   async (c) => {
//     const payload = c.get("jwtPayload");
//     console.log(JSON.stringify(payload, null, 2));
//     await addJtiRevoked(payload?.jti);
//     return c.json(
//       {
//         message: `Logged ${payload.user.stxAddressMainnet} out successfully`,
//       },
//       200,
//     );
//   },
// );
