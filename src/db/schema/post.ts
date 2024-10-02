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
import { relations } from "drizzle-orm";
import { categoryTable, commentTable, userTable } from ".";

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

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(userTable, {
    fields: [post.userId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
  category: one(categoryTable, {
    fields: [post.categoryId],
    references: [categoryTable.id],
  }),
}));
