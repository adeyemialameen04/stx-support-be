import { createRoute, z } from "@hono/zod-openapi";
import { selectUserSchema } from "../db/schema/users";
import { ZodType } from "zod";
import { notFoundError } from "../lib/schemas";

const tags = ["users"];

export const jsonContent = (schema: ZodType) => {
  return {
    "application/json": {
      schema,
    },
  };
};

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
  request: {
    params: ParamsSchema,
  },
  tags,
  responses: {
    200: {
      content: jsonContent(selectUserSchema.openapi("User")),
      description: "Retrieve the user",
    },
    404: notFoundError,
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
