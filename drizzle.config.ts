import { defineConfig } from "drizzle-kit";
import { settings } from "./src/config/settings";

export default defineConfig({
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: settings.DATABASE_URL,
    ssl: true,
  },
});
