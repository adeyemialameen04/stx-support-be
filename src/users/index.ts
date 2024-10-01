import { OpenAPIHono } from "@hono/zod-openapi";
import { getAllUsers, getUser } from "./routes";
import { AppBindings } from "../lib/types";
import { getAllUsersHandler, getUserHandler } from "./handlers";

const route = new OpenAPIHono<AppBindings>();

const router = route
  .openapi(getAllUsers, getAllUsersHandler)
  .openapi(getUser, getUserHandler);

export default router;
