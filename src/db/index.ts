import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import logger from "../utils/logger";
import { users } from "./schema/users";
import env from "../env";

export const client = postgres(env.DATABASE_URL, {
  ssl: "require",
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
});
export const db: PostgresJsDatabase = drizzle(client, { logger: true });

export const main = async () => {
  logger.info("running...");
};
