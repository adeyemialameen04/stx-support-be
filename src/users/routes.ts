import { createRoute, z } from "@hono/zod-openapi";
import {
  accessTokenMiddleware,
  validTokenMiddleware,
} from "../auth/middleware";
import { jsonContent } from "@/lib/helpers";
import { createErrorSchema } from "@/lib/schemas";
import { selectUserSchema } from "@/db/schema/user";

const tags = ["users"];

const ParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: "id",
        in: "path",
      },
      example: "c14f9bb2-12a5-42ec-8174-a34e0f577cc1",
    }),
});

export const getUser = createRoute({
  method: "get",
  path: "/{id}",
  middleware: [validTokenMiddleware, accessTokenMiddleware],
  request: {
    params: ParamsSchema,
  },
  tags,
  responses: {
    200: {
      content: jsonContent(selectUserSchema.openapi("User")),
      description: "Retrieve the user",
    },
    404: createErrorSchema(404, "User not found", "Not found"),
  },
  security: [{ AccessTokenBearer: [] }],
});

export const getAllUsers = createRoute({
  method: "get",
  path: "/all",
  tags,
  responses: {
    200: {
      content: jsonContent(selectUserSchema.array()),
      description: "Get all users",
    },
  },
});
