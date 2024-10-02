import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { postTable } from ".";

export const category = pgTable("category", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  posts: many(postTable),
}));
