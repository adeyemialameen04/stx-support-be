import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { Payload } from "../../auth/middleware";

export type Env = {
  SECRET: string;
};

export type AppBindings = {
  Bindings: Env;
  Variables: {
    jwtPayload: Payload;
  };
};

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<
  T,
  AppBindings
>;
