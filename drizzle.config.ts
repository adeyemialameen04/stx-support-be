import { defineConfig } from "drizzle-kit";
import { settings } from "./src/config/settings";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: settings.DATABASE_URL,
    ssl: true,
  },
});
