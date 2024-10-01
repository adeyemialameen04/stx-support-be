import { logger } from "hono/logger";
import { settings } from "./config/settings";
import { swaggerUI } from "@hono/swagger-ui";
import { main } from "./db";
import { authRouter } from "./auth/router";
import { createPath } from "./utils/path";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import router from "./users";

const app = new OpenAPIHono();
app.use("*", logger());

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: settings.VERSION,
    title: settings.PROJECT_NAME,
  },
});

app.get("/docs", swaggerUI({ url: "doc" }));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
app.route(createPath("/auth"), authRouter);
app.route(createPath(""), router);

main();

export default app;
