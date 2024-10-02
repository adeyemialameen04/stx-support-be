import { createRoute, z } from "@hono/zod-openapi";
import {
  accessTokenMiddleware,
  refreshTokenMiddleware,
  validTokenMiddleware,
} from "./middleware";
import { selectUserSchema } from "@/db/schema/user";
import { createErrorSchema } from "@/lib/schemas";
import {
  jsonContent,
  refreshTokenSecurity,
  accessTokenSecurity,
} from "@/lib/helpers";

const tags = ["auth"];

export const authSchema = z.object({
  stxAddressMainnet: z.string().min(1),
  password: z.string().min(6),
});

export const payloadSchema = z.object({
  user: z.object({
    stxAddressMainnet: z.string(),
    id: z.string().uuid(),
  }),
  exp: z.number(),
  jti: z.string().uuid(),
  refresh_token: z.boolean(),
});

const loginResponse = z
  .object({
    message: z.string().default("Login successful"),
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExpiryTimestamp: z.number(),
    refreshTokenExpiryTimestamp: z.number(),
    user: z.object({
      id: z.string().uuid(),
      stxAddressMainnet: z.string(),
    }),
  })
  .openapi("LoginResponse");

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: authSchema.openapi("Auth"),
        },
      },
    },
  },
  responses: {
    200: {
      content: jsonContent(loginResponse),
      description: "Login",
    },
    401: createErrorSchema(401, "Invalid username or password", "Unauthorized"),
  },
});

export const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: authSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: jsonContent(selectUserSchema),
      description: "Sign up",
    },
    409: createErrorSchema(409, "Username already exists", "Conflict"),
  },
});

export const refreshRoute = createRoute({
  method: "get",
  path: "/refresh",
  middleware: [validTokenMiddleware, refreshTokenMiddleware],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            accessToken: z.string(),
            accessTokenExpiryTimestamp: z
              .number()
              .openapi({ example: Math.floor(Date.now() / 1000) }),
          }),
        },
      },
      description: "Refresh Access Tokens",
    },
    // 401: createErrorSchema(401, "string", "Unauthorized"),
  },
  security: refreshTokenSecurity,
  tags,
});

export const logoutRoute = createRoute({
  method: "get",
  path: "/logout",
  middleware: [validTokenMiddleware, accessTokenMiddleware],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.number().default(200),
            detail: z.string().default("Logout successful"),
          }),
        },
      },
      description: "Log user out",
    },
  },
  tags,
  security: accessTokenSecurity,
});
