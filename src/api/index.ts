import { generateOpenApi } from "@ts-rest/open-api";
import { contracts } from "./contracts";
import { settings } from "../config/settings";

const hasCustomTags = (
  metadata: unknown,
): metadata is { openApiTags: string[] } => {
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
    components: {
      securitySchemes: {
        // Changed from securitySchemas to securitySchemes
        AccessTokenBearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        RefreshTokenBearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // security: [{ BearerAuth: [] }], // Add this line to set global security
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
