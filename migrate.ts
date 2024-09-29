import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { settings } from "./src/config/settings";

const migrationClient = postgres(settings.DATABASE_URL, { max: 1 });
const run = async () => {
  await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
};

run();

console.log("migration completed");
