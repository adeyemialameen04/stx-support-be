import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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
    // name: varchar("name", { length: 256 }),
    username: varchar("username"),
    uuid: uuid("uuid").defaultRandom().notNull().primaryKey(),
  },
  // (users) => {
  //   return {
  //     userIdIndex: index("name_idx").on(users.uuid),
  //   };
  // },
);
