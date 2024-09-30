import { Context, Next } from "hono";
import { ZodError } from "zod";

export const zodErrorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
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
  }
};
