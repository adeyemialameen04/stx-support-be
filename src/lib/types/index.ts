import { Context, Next } from "hono";  // Assume 'hono' provides these types

// Define a generic AppRouteHandler type with route configuration (T)
export type AppRouteHandler<T extends RouteConfig = RouteConfig> = (
  c: Context<
    AppBindings,                // The type of the app's bindings (e.g., environment variables)
    ConvertPathType<T["path"]>, // Path parameters
    "params",                   // Path parameter name
    InputTypeBase<T, "query", "query"> & // Query parameters
    InputTypeForm<T, ...> &      // Form data (if applicable)
    InputTypeJson<T, ...>        // JSON data (if applicable)
  >,
  next: Next                     // The 'next' function for middleware
) => MaybePromise<T>;             // Return type can be Promise or sync
