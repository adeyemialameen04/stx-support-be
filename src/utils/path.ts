import { settings } from "../config/settings";

export const createPath = (path: string) => `${settings.API_V1_PREFIX}${path}`;
