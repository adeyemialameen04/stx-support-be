import { logger } from "hono/logger";
import { settings } from "./config/settings";
import { swaggerUI } from "@hono/swagger-ui";
import { main } from "./db";
import { createPath } from "./utils/path";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as userRouter from "./users";
import * as authRouter from "./auth";

const app = new OpenAPIHono();
app.use("*", logger());

app.doc31("/openapi.json", (c) => ({
  openapi: "3.1.0",
  info: {
    version: settings.VERSION,
    title: settings.PROJECT_NAME,
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: "Current environment",
    },
  ],
}));

app.openAPIRegistry.registerComponent("securitySchemes", "AccessTokenBearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

app.openAPIRegistry.registerComponent("securitySchemes", "RefreshTokenBearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

app.get("/docs", swaggerUI({ url: "openapi.json" }));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
app.route(createPath("/auth"), authRouter.default);
app.route(createPath("/users"), userRouter.default);

await main();

export default app;
