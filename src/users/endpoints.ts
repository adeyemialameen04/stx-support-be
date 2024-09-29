import { createHonoEndpoints } from "ts-rest-hono";
import { contract } from "./contract";
import { router } from "./router";
import { Hono } from "hono";

export const registerUserEndpoints = (app: Hono) => {
  createHonoEndpoints(contract, router, app);
};
