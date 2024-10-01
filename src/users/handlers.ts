// import { Context } from "hono";
// import { db } from "../db";
// import { users as userTable } from "../db/schema/users";
// import { eq } from "drizzle-orm";
// import logger from "../utils/logger";
// import { AppRouteHandler } from "../lib/types";
// import { getUser } from "./routes";
//
// export const getUserHandler: AppRouteHandler<typeof getUser> = async (
//   c: Context,
// ) => {
//   const { id } = c.req.valid("param");
//   logger.info(id);
//   const [user] = await db
//     .select()
//     .from(userTable)
//     .where(eq(userTable.id, id))
//     .limit(1);
//
//   if (!user) {
//     return c.json({ status_code: 404, detail: "User not found" }, 404);
//   }
//
//   return user;
// };
