import { initServer } from "ts-rest-hono";
import { contract, UserSchema } from "./contract";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "../db";
import { users as userTable } from "../db/schema/users";

const s = initServer();

type User = z.infer<typeof UserSchema>;
const users: User[] = [];

export const router = s.router(contract, {
  getUsers: async () => {
    const usersDb = await db.select().from(userTable);
    const validUsers: User[] = usersDb.map((user) => ({
      uuid: user.uuid,
      username: user.username ?? undefined,
    }));

    return {
      status: 200,
      body: validUsers,
    };
  },
  createUser: async ({ body: { username } }) => {
    // const user = {
    //   // uuid: nanoid(),
    //   username,
    // };
    const user = await db.insert(userTable).values({ username }).returning();

    return {
      status: 201,
      body: user,
    };
  },
});

// If you need to access the tags for OpenAPI generation
// export const getOpenAPITags = () => {
//   return Object.entries(contract).reduce(
//     (acc, [key, value]) => {
//       if (value.metadata?.tags) {
//         value.metadata.tags.forEach((tag) => {
//           if (!acc.some((t) => t.name === tag)) {
//             acc.push({ name: tag });
//           }
//         });
//       }
//       return acc;
//     },
//     [] as { name: string }[],
//   );
// };
