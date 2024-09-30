import { Context } from "hono";
import { settings } from "../config/settings";
import logger from "../utils/logger";
import { createMiddleware } from "hono/factory";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { verify } from "hono/jwt";

type Env = {
  Variables: {
    user: any;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  logger.info("Auth middleware");
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verify(token, settings.SECRET_KEY as string);
    logger.info(decoded);
    logger.info(decoded);
    c.set("user", decoded);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Invald token" });
  }
});

export const accessTokenMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verify(token, settings.SECRET_KEY as string);
    console.log(JSON.stringify(decoded, null, 2));
    if (decoded.refresh_token) {
      return c.json(
        { status_code: 403, detail: "Please provide a valid access token" },
        403,
      );
    }
    c.set("user", decoded);
    await next();
  } catch (err) {
    if (err instanceof JwtTokenExpired) {
      console.log("expired");
      return c.json(
        { status_code: 403, detail: "This token has expired" },
        403,
      );
    }
    return c.json({ status_code: 403, detail: "Invald token" }, 403);
  }
});
