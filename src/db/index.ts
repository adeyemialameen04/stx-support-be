import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import logger from "../utils/logger";
import env from "../env";
import { userTable } from "./schema";

export const client = postgres(env.DATABASE_URL, {
  ssl: "require",
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : 3,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
});
export const db: PostgresJsDatabase = drizzle(client, { logger: true });

export const main = async () => {
  logger.info("running...");
};
