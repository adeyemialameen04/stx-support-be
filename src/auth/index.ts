import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "../lib/types";
import { loginRoute } from "./routes";
import { loginHandler } from "./handlers";

const route = new OpenAPIHono<AppBindings>();

const router = route.openapi(loginRoute, loginHandler);

export default router;
