import { settings } from "../config/settings";
import { createMiddleware } from "hono/factory";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { verify } from "hono/jwt";
import { isTokenInRevoked } from "../db/redis";
import { z } from "zod";
import { payloadSchema } from "./routes";

export type Payload = z.infer<typeof payloadSchema>;

type Env = {
  Variables: {
    jwtPayload: Payload;
  };
};

export const accessTokenMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        detail: "Authentication required. Access token is missing.",
        status: 401,
        error: "Unauthorized",
      },
      401,
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, settings.SECRET_KEY as string);

    if (payload.refresh_token) {
      return c.json(
        {
          status: 401,
          detail: "Invalid token type. Access token required.",
          error: "Unauthorized",
        },
        401,
      );
    }
    await next();
  } catch (err) {
    return c.json({ status: 401, detail: "Invald token" }, 401);
  }
});

export const refreshTokenMiddleware = createMiddleware(async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return c.json(
      {
        detail: "Authentication required. Access token is missing.",
        status: 401,
        error: "Unauthorized",
      },
      401,
    );
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = await verify(token, settings.SECRET_KEY as string);

    if (!payload.refresh_token) {
      return c.json(
        {
          status: 401,
          detail: "Invalid token type. Refresh token required.",
          error: "Unauthorized",
        },
        401,
      );
    }
    await next();
  } catch (err) {
    return c.json({ status_code: 401, detail: "Invald token" }, 401);
  }
});

export const validTokenMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        detail: "Authentication required. Access token is missing.",
        status: 401,
        error: "Unauthorized",
      },
      401,
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, settings.SECRET_KEY as string);
    const jti = payload.jti as string;

    if (await isTokenInRevoked(jti)) {
      return c.json(
        {
          status: 401,
          detail: "Token has been revoked. Refresh",
          error: "Unauthorized",
        },
        401,
      );
    }

    c.set("jwtPayload", payload);

    await next();
  } catch (error) {
    if (error instanceof JwtTokenExpired) {
      return c.json(
        { status: 401, detail: "Token has expired", error: "Unauthorized" },
        401,
      );
    }

    return c.json(
      { status: 401, detail: "Invald token", error: "Unauthorized" },
      401,
    );
  }
});
