import Redis from "ioredis";
import { settings } from "../config/settings";

interface RedisSettings {
  host: string;
  port: number;
}

const redisSettings: RedisSettings = {
  host: settings.REDIS_HOST ?? "localhost",
  port: settings.REDIS_PORT ?? 6379,
};

const revokedTokens = new Redis({
  host: redisSettings.host,
  port: redisSettings.port,
  db: 0,
});

async function addJtiRevoked(jti: string): Promise<void> {
  await revokedTokens.set(jti, "");
}

async function isTokenInRevoked(jti: string): Promise<boolean> {
  const result = await revokedTokens.get(jti);
  return result !== null;
}
export { addJtiRevoked, isTokenInRevoked };
