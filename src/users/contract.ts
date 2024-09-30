import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { createPath } from "../utils/path";
import { notFoundSchema } from "../utils/api";
import { insertUserSchema, selectUserSchema } from "../db/schema/users";
import { settings } from "../config/settings";

const c = initContract();

export const contract = c.router(
  {
    getUsers: {
      method: "GET",
      path: "/users/all",
      responses: {
        200: selectUserSchema.array(),
        401: z.object({ error: z.string() }),
      },
      summary: "Get all users",
      metadata: {
        openApiTags: ["users"],
      },
    },
    // createUser: {
    //   method: "POST",
    //   path: createPath("/users"),
    //   responses: {
    //     201: selectUserSchema,
    //     401: z.object({ error: z.string() }),
    //   },
    //   summary: "create a user",
    //   body: insertUserSchema.omit({ id: true }),
    //   metadata: {
    //     openApiTags: ["users"],
    //     openApiSecurity: [{ BearerAuth: [] }],
    //   },
    // },
    getUser: {
      method: "GET",
      path: "/users",
      query: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: selectUserSchema,
        404: notFoundSchema,
        401: z.object({ error: z.string() }),
      },
      metadata: {
        openApiTags: ["users"],
        openApiSecurity: [{ AccessTokenBearer: [] }],
      },
    },
  },
  {
    pathPrefix: settings.API_V1_PREFIX,
  },
);
