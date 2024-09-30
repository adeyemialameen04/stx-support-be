import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createPath } from "../utils/path";
import { notFoundSchema } from "../utils/api";
import { insertUserSchema, selectUserSchema } from "../db/schema/users";
const c = initContract();

// export const userSchema = z.object({
//   id: z.string().uuid(),
//   username: z.string().nullable().optional(),
// });
// export const userCreateSchema = userSchema.omit({ id: true });

export const contract = c.router({
  getUsers: {
    method: "GET",
    path: createPath("/users/all"),
    responses: {
      200: selectUserSchema.array(),
    },
    summary: "Get all users",
    metadata: {
      openApiTags: ["users"],
    },
  },
  createUser: {
    method: "POST",
    path: createPath("/users"),
    responses: {
      201: selectUserSchema,
    },
    summary: "create a user",
    body: insertUserSchema.omit({ id: true }),
    metadata: {
      openApiTags: ["users"],
    },
  },
  getUser: {
    method: "GET",
    path: createPath("/users"),
    query: z.object({
      userId: z.string().uuid(),
    }),
    responses: {
      200: selectUserSchema,
      404: notFoundSchema,
    },
    metadata: {
      openApiTags: ["users"],
    },
  },
});
