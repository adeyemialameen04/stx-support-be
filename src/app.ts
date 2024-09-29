import { Hono } from "hono";
import { logger } from "hono/logger";
import { settings } from "./config/settings";
import { swaggerUI } from "@hono/swagger-ui";
import { registerUserEndpoints } from "./users/endpoints";
import { openApiDoc } from "./api";

const app = new Hono();
app.use("*", logger());

app.get("/openapi.json", (c) => {
  return c.json(openApiDoc);
});
app.get("/ui", swaggerUI({ url: "/openapi.json" }));

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

registerUserEndpoints(app);

console.log(settings);
export default app;
