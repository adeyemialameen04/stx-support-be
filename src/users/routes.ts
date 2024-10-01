import { createRoute, z } from "@hono/zod-openapi";
import { selectUserSchema } from "../db/schema/users";
import { ZodObject } from "zod";

const tags = ["users"];

const jsonContent = (schema: ZodObject) => {
  return {
    "application/json": {
      schema,
    },
  };
};

export const notFoundError = {
  content: {
    "application/json": {
      schema: z
        .object({
          message: z.string(),
        })
        .openapi("NotFoundError"),
    },
  },
  description: "Resource not found",
} as const;

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
  path: "/users/{id}",
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
});
