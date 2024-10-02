import { OpenAPIHono } from "@hono/zod-openapi";
import { AppBindings } from "../lib/types";
import { loginRoute, logoutRoute, refreshRoute, signupRoute } from "./routes";
import {
  loginHandler,
  logoutHandler,
  refreshhandler,
  signupHandler,
} from "./handlers";

const route = new OpenAPIHono<AppBindings>();
const router = route
  .openapi(loginRoute, loginHandler)
  .openapi(signupRoute, signupHandler)
  .openapi(refreshRoute, refreshhandler)
  .openapi(logoutRoute, logoutHandler);

export default router;
