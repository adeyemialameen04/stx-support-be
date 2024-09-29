import { initContract } from "@ts-rest/core";
import { z } from "zod";
// import { extendZodWithOpenApi } from "@anatine/zod-openapi";
// extendZodWithOpenApi(z);
const c = initContract();

export const UserSchema = z.object({
  username: z.string().optional(),
});

export const contract = c.router({
  getUsers: {
    method: "GET",
    path: "/users/all",
    responses: {
      200: UserSchema.array(),
    },
    summary: "Get all users",
    metadata: {
      openApiTags: ["users"],
    },
  },
});
