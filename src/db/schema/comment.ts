import {
  AnyPgColumn,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { postTable, userTable } from ".";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const comment = pgTable("comment", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  parentId: uuid("parent_id").references((): AnyPgColumn => comment.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  content: text("content").notNull(),
  postId: uuid("post_id").references(() => postTable.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const commentRelations = relations(comment, ({ one }) => ({
  user: one(userTable, {
    fields: [comment.userId],
    references: [userTable.id],
  }),
  post: one(postTable, {
    fields: [comment.postId],
    references: [postTable.id],
  }),
}));

export const insertCommentScheme = createInsertSchema(comment).omit({
  id: true,
  createdAt: true,
});
