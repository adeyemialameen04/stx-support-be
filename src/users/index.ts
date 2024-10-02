import { OpenAPIHono } from "@hono/zod-openapi";
import { getAllUsers, getUser } from "./routes";
import { getAllUsersHandler, getUserHandler } from "./handlers";
import { AppBindings } from "@/lib/types";

const route = new OpenAPIHono<AppBindings>();

const router = route
  .openapi(getAllUsers, getAllUsersHandler)
  .openapi(getUser, getUserHandler);

export default router;
