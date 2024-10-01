import { time } from "drizzle-orm/mysql-core";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 255 }).unique(),
    name: varchar("name", { length: 100 }),
    profileImg: text("profile_img"),
    coverImg: text("cover_img"),
    about: text("about"),
    stxAddressTestnet: text("stx_address_testnet"),
    stxAddressMainnet: text("stx_address_mainnet").notNull(),
    btcAddressTestnet: text("btc_address_testnet"),
    btcAddressMainnet: text("btc_address_mainnet"),
    password_hash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  },
);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users).omit({
  password_hash: true,
});
