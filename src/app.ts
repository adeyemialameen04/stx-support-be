import { Hono } from "hono";
import { logger } from "hono/logger";
import { settings } from "./config/settings";
import { swaggerUI } from "@hono/swagger-ui";
import { registerUserEndpoints } from "./users/endpoints";
import { openApiDoc } from "./api";
import { main } from "./db";
import { authRouter } from "./auth/router";
import { authMiddleware } from "./auth/middleware";
import { createPath } from "./utils/path";
import { zodErrorHandler } from "./middleware/zod-error-handler";

const app = new Hono();
app.use("*", logger());
app.use("*", zodErrorHandler);

app.get("/openapi.json", (c) => {
  return c.json(openApiDoc);
});
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
app.route(createPath("/auth"), authRouter);

app.use(createPath("/users/*"), authMiddleware);
// app.get("/user", aut async (c) => {
//   const user = c.var.get("user");
//   return c.json({ user: user });
// });

registerUserEndpoints(app);

main();

export default app;
