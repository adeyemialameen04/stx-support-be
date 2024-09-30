import { Hono } from "hono";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import { initContract } from "@ts-rest/core";

const c = initContract();

export const authContract = c.router({
  login: {
    method: "POST",
    path: "/auth/login",
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
      401: z.object({ error: z.string() }),
    },
    body: z.object({
      username: z.string(),
      password: z.string(),
    }),
    summary: "User login",
  },
  refresh: {
    method: "POST",
    path: "/auth/refresh",
    responses: {
      200: z.object({ accessToken: z.string() }),
      401: z.object({ error: z.string() }),
    },
    body: z.object({ refreshToken: z.string() }),
    summary: "Refresh access token",
  },
  logout: {
    method: "POST",
    path: "/auth/logout",
    responses: {
      200: z.object({ message: z.string() }),
    },
    body: z.object({ refreshToken: z.string() }),
    summary: "User logout",
  },
});
