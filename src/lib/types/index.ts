import { RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type Env = {
  SECRET: string;
};

export type AppBindings = {
  Bindings: Env;
  Variables: {
    // user: selectUse | null;
  };
};

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<
  T,
  AppBindings
>;
