import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { createPath } from "../utils/path";
import { tokens } from "../utils/tokens";

const c = initContract();

export const loginSchema = z.object({
  stxAddressMainnet: z.string().min(1),
  password: z.string().min(6),
});

export const authContract = c.router({
  login: {
    method: "POST",
    path: createPath("/auth/login"),
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
      401: z.object({ error: z.string() }),
    },
    metadata: {
      openApiTags: ["auth"],
    },
    body: loginSchema,
    summary: "User login",
  },
  signup: {
    method: "POST",
    path: createPath("/auth/signup"),
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
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
    path: createPath("/auth/refresh"),
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
    path: createPath("/auth/logout"),
    responses: {
      200: z.object({ message: z.string() }),
    },
    summary: "User logout",
    metadata: {
      openApiTags: ["auth"],
      openApiSecurity: [{ [tokens.access]: [] }],
    },
  },
});
