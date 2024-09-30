import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { createPath } from "../utils/path";
import { tokens } from "../utils/tokens";
import { selectUserSchema } from "../db/schema/users";

const c = initContract();

export const loginSchema = z.object({
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

export const authContract = c.router(
  {
    login: {
      method: "POST",
      path: "/auth/login",
      responses: {
        200: z.object({
          message: z.string().default("Login successful"),
          accessToken: z.string(),
          refreshToken: z.string(),
          accessTokenExpiryTimestamp: z.number(),
          refreshTokenExpiryTimestamp: z.number(),
          user: z.object({
            id: z.string().uuid(),
            stxAddressMainnet: z.string(),
          }),
        }),
        401: z.object({
          status_code: z.number().default(401),
          detail: z.string().default("Invalid credentials"),
        }),
        404: z.object({
          status_code: z.number().default(404),
          detail: z.string().default("User does not exist"),
        }),
      },
      metadata: {
        openApiTags: ["auth"],
      },
      body: loginSchema,
      summary: "User login",
    },
    signup: {
      method: "POST",
      path: "/auth/signup",
      responses: {
        200: selectUserSchema,
        401: z.object({ error: z.string() }),
      },
      metadata: {
        openApiTags: ["auth"],
      },
      body: loginSchema,
      summary: "User Signup",
    },
    refresh: {
      method: "GET",
      path: "/auth/refresh",
      responses: {
        200: z.object({ accessToken: z.string() }),
        401: z.object({ error: z.string() }),
      },
      metadata: {
        openApiTags: ["auth"],
        openApiSecurity: [{ [tokens.refresh]: [] }],
      },
      summary: "Refresh access token",
    },
    logout: {
      method: "GET",
      path: "/auth/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
      summary: "User logout",
      metadata: {
        openApiTags: ["auth"],
        openApiSecurity: [{ [tokens.access]: [] }],
      },
    },
  },
  {
    pathPrefix: "/api/v1",
  },
);
