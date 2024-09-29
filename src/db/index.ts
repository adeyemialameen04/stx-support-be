import postgres from "postgres";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { settings } from "../config/settings";
import logger from "../utils/logger";

const client = postgres(settings.DATABASE_URL, { ssl: "require" });
export const db: PostgresJsDatabase = drizzle(client);

export const main = async () => {
  logger.info("running...");
  // console.log(db);
};
