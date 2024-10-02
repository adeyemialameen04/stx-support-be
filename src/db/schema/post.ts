import {
  boolean,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { category } from "./category";
import { user } from "./user";

export const statusEnum = pgEnum("status", ["published", "draft", "archived"]);

export const post = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  status: statusEnum("status"),
  isPublic: boolean("is_public").default(true).notNull(),
  content: json("content").notNull(),
  categoryId: uuid("category_id")
    .references(() => category.id)
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});
