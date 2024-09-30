import { Context } from "hono";
import { ZodError } from "zod";

export const handleValidation = (error: unknown, c: Context) => {
  if (error instanceof ZodError) {
    c.status(422);
    return c.json({
      message: "Validation error",
      errors: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }
  throw error;
};
