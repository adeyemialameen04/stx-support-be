import { z } from "@hono/zod-openapi";

const baseErrorSchema = z.object({
  detail: z.string(),
  status: z.number(),
});

const createErrorSchema = (defaultStatus: number, description: string) => {
  return {
    content: {
      "application/json": {
        schema: baseErrorSchema.extend({
          status: z.literal(defaultStatus),
        }),
        // .openapi(`Error${defaultStatus}`),
      },
    },
    description,
  } as const;
};

export const notFoundError = createErrorSchema(404, "Resource not found");
export const unauthorizedError = createErrorSchema(401, "Unauthorized access");
export const internalServerError = createErrorSchema(
  500,
  "Internal server error",
);
