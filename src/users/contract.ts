import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createPath } from "../utils/path";
// import { extendZodWithOpenApi } from "@anatine/zod-openapi";
// extendZodWithOpenApi(z);
const c = initContract();

export const UserSchema = z.object({
  uuid: z.string().uuid(),
  username: z.string().optional(),
});
export const UserCreateSchema = UserSchema.omit({ uuid: true });

export const contract = c.router({
  getUsers: {
    method: "GET",
    path: createPath("/users/all"),
    responses: {
      200: UserSchema.array(),
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
      201: UserSchema,
    },
    summary: "create a user",
    body: UserCreateSchema,
    metadata: {
      openApiTags: ["users"],
    },
  },
});
