import { pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// username: str | None = Field(default=None, min_length=3, unique=True)
// name: str | None = Field(None, min_length=3)
// profile_picture: str | None = Field(None, min_length=3, max_length=100)
// about_me: str | None = Field(None, min_length=3, max_length=100)
// #     Stacks stuff
// prevTxID: str | None = Field(default=None)
// stx_address_testnet: str | None = Field(default=None, unique=True)
// btc_address_mainnet: str | None = Field(default=None, unique=True)
// btc_address_testnet: str | None = Field(default=None, unique=True)
// pronouns: dict | None = Field(default_factory=dict, sa_column=Column(JSON))
// bio: str | None = Field(None, min_length=3, max_length=100)
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
    stxAddressMainnet: text("stx_address_mainnet"),
    btcAddressTestnet: text("btc_address_testnet"),
    btcAddressMainnet: text("btc_address_mainnet"),
  },
  (table) => {
    return {
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  },
);

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
