import { Context } from "hono";
import { settings } from "../config/settings";
import logger from "../utils/logger";
import { createMiddleware } from "hono/factory";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { verify } from "hono/jwt";
import { isTokenInRevoked } from "../db/redis";
import { z } from "zod";
import { payloadSchema } from "./contract";

type Payload = z.infer<typeof payloadSchema>;

type Env = {
  Variables: {
    jwtPayload: Payload;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  // logger.info("Auth middleware");
  // const authHeader = c.req.header("Authorization");
  //
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return c.json({ error: "Unauthorized" }, 401);
  // }
  //
  // const token = authHeader.split(" ")[1];
  //
  // try {
  //   const decoded = await verify(token, settings.SECRET_KEY as string);
  //   logger.info(decoded);
  //   logger.info(decoded);
  //   c.set("user", decoded);
  //   await next();
  // } catch (err) {
  //   c.status(401);
  //   return c.json({ error: "Invald token" });
  // }
});

export const accessTokenMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("accessToken");
    const payload = await verify(token, settings.SECRET_KEY as string);
    console.log(JSON.stringify(payload, null, 2), "from accedd");

    if (payload.refresh_token) {
      console.log("Hmmmm");
      return c.json(
        { status_code: 403, detail: "Please provide a valid access token" },
        403,
      );
    }
    await next();
  } catch (err) {
    return c.json({ status_code: 403, detail: "Invald token" }, 403);
  }
});

export const refreshTokenMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("accessToken");
    const payload = await verify(token, settings.SECRET_KEY as string);
    console.log(JSON.stringify(payload, null, 2), "from accedd");

    if (!payload.refresh_token) {
      console.log("Hmmmm");
      return c.json(
        { status_code: 403, detail: "Please provide a valid refresh token" },
        403,
      );
    }
    await next();
  } catch (err) {
    return c.json({ status_code: 403, detail: "Invald token" }, 403);
  }
});

export const validTokenMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, settings.SECRET_KEY as string);
    const jti = payload.jti as string;

    if (await isTokenInRevoked(jti)) {
      return c.json({ error: "Token has been revoked" }, 401);
    }

    c.set("jwtPayload", payload);

    await next();
  } catch (error) {
    if (error instanceof JwtTokenExpired) {
      console.log("expired");
      return c.json(
        { status_code: 403, detail: "This token has expired" },
        403,
      );
    }

    return c.json({ status_code: 401, detail: "Invald token" }, 401);
  }
});
