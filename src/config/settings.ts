export const settings = {
  API_V1_PREFIX: process.env.API_V1_PREFIX || "/api/v1", // Default value if not set
  PROJECT_NAME: process.env.PROJECT_NAME || "Stx-Support",
  VERSION: process.env.VERSION || "1.0",
  DESCRIPTION: process.env.DESCRIPTION || "The Backend Api for Stacks Support",

  DATABASE_URL: process.env.DB_ASYNC_CONNECTION_STR || "", // Make sure to use the right variable name
  DB_EXCLUDE_TABLES: process.env.DB_EXCLUDE_TABLES || '[""]',

  SECRET_KEY: process.env.SECRET_KEY || "default_secret_key", // Set a default for safety
  ALGORITHM: process.env.ALGORITHM || "HS256",
  ACCESS_TOKEN_EXPIRE_SECONDS: parseInt(
    process.env.ACCESS_TOKEN_EXPIRE_SECONDS || "900",
  ),
  REFRESH_TOKEN_EXPIRE_DAYS: parseInt(
    process.env.REFRESH_TOKEN_EXPIRE_DAYS || "7",
  ),

  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
  JTI_EXPIRY: parseInt(process.env.JTI_EXPIRY || "3600"),
};
