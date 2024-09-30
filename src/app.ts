import { Hono } from "hono";
import { logger } from "hono/logger";
import { settings } from "./config/settings";
import { swaggerUI } from "@hono/swagger-ui";
import { registerUserEndpoints } from "./users/endpoints";
import { openApiDoc } from "./api";
import { main } from "./db";
import { authRouter } from "./auth/router";
import { authMiddleware } from "./auth/middleware";

const app = new Hono();
app.use("*", logger());

app.get("/openapi.json", (c) => {
  return c.json(openApiDoc);
});
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
app.route("/auth", authRouter);
app.use("/users/*", authMiddleware);
registerUserEndpoints(app);
main();

export default app;
