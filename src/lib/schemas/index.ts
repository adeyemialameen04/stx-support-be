import { z } from "@hono/zod-openapi";

const baseErrorSchema = z
  .object({
    detail: z.string(),
    status: z.number(),
    error: z.string(),
  })
  .openapi("ErrorResponse");

export const createErrorSchema = (
  defaultStatus: number,
  description: string,
  error: string,
) => {
  return {
    content: {
      "application/json": {
        schema: baseErrorSchema.extend({
          status: z.literal(defaultStatus),
          detail: z.literal(description),
          error: z.literal(error),
        }),
      },
    },
    description,
  } as const;
};
