import { Context } from "hono";
import { verify } from "jsonwebtoken";
import { settings } from "../config/settings";

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, settings.SECRET_KEY as string);
    c.set("user", decoded);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Invald token" });
  }
};
