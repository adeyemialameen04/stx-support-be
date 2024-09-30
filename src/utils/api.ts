import { z } from "zod";

export const handleNotFound = (resource: string) => {
  return {
    status: 404 as const,
    body: {
      status: 404,
      detail: `${resource} not found`,
    },
  };
};

export const notFoundSchema = z.object({
  status: z.number(),
  detail: z.string(),
});

export const createErrorResponse = (statusCode: number, detail: string) => ({
  status_code: statusCode,
  detail,
});
