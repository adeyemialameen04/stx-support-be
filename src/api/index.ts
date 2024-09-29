import { generateOpenApi } from "@ts-rest/open-api";
import { contracts } from "./contracts";
import { settings } from "../config/settings";

const hasCustomTags = (
  metadata: unknown,
): metadata is { openApiTags: string[] } => {
  console.log(metadata, "Hello");

  return (
    !!metadata && typeof metadata === "object" && "openApiTags" in metadata
  );
};

const hasSecurity = (
  metadata: unknown,
): metadata is { openApiSecurity: any } => {
  return (
    !!metadata && typeof metadata === "object" && "openApiSecurity" in metadata
  );
};

export const openApiDoc = generateOpenApi(
  // @ts-ignore
  contracts,
  {
    info: {
      title: settings.PROJECT_NAME,
      version: settings.VERSION,
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [{ name: "users", description: "User operations" }],
  },
  {
    operationMapper: (operation, appRoute) => ({
      ...operation,
      ...(hasCustomTags(appRoute.metadata)
        ? {
            tags: appRoute.metadata.openApiTags,
          }
        : {}),
      ...(hasSecurity(appRoute.metadata)
        ? {
            security: appRoute.metadata.openApiSecurity,
          }
        : {}),
    }),
  },
);
