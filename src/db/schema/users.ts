import { pgTable, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    username: varchar("username", { length: 255 }).unique(),
    id: uuid("id").primaryKey().defaultRandom(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  },
);
