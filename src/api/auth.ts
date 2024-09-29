import { Hono } from "hono";
export const authRouter = new Hono();
authRouter.get("", (c) => {
  return c.json({ message: "Hello" });
});
