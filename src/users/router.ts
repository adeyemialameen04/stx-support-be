import { initServer } from "ts-rest-hono";
import { contract } from "./contract";
import { db } from "../db";
import { user as userTable } from "../db/schema/users";
import logger from "../utils/logger";
import { eq } from "drizzle-orm";
import { handleNotFound } from "../utils/api";

const s = initServer();

export const router = s.router(contract, {
  getUsers: async () => {
    const usersDb = await db.select().from(userTable);
    return {
      status: 200,
      body: usersDb,
    };
  },
  // createUser: async ({ body: { username } }) => {
  //   logger.info(username);
  //   const [user] = await db.insert(userTable).values({ username }).returning();
  //   console.log(user);
  //   return {
  //     status: 201,
  //     body: user,
  //   };
  // },
  getUser: async ({ query: { userId } }) => {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (!user) {
      return handleNotFound("User");
    }

    return {
      status: 200,
      body: user,
    };
  },
});
