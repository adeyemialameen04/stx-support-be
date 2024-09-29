import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRouter } from "./api/auth";
import { settings } from "./config/settings";

const app = new Hono();
app.use("*", logger());

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
app.route("/api/v1/auth", authRouter);

console.log(settings);
export default app;
