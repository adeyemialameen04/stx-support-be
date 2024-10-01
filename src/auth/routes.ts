import { createRoute, z } from "@hono/zod-openapi";
import { loginSchema } from "./contract";
import { jsonContent } from "../users/routes";
import { ZodError } from "zod";
import { ZodErrorSchema } from "@ts-rest/core";
import { notFoundError, unauthorizedError } from "../lib/schemas";

const tags = ["auth"];

const loginResponse = z
  .object({
    message: z.string().default("Login successful"),
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiryTimestamp: z.number(),
    refreshTokenExpiryTimestamp: z.number(),
    user: z
      .object({
        id: z.string().uuid(),
        stxAddressMainnet: z.string(),
      })
      .openapi("User"),
  })
  .openapi("LoginSchema");

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: jsonContent(loginResponse),
      description: "Login",
    },
    404: notFoundError,
    401: unauthorizedError,
  },
});
