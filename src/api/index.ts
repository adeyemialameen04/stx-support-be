import { generateOpenApi } from "@ts-rest/open-api";
import { contracts } from "./contracts";
import { getOpenAPITags, router } from "../users/router";
import { contract } from "../users/contract";

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

// @ts-ignore
export const openApiDoc = generateOpenApi(
  contracts,
  {
    info: {
      title: "Stx-Support Api",
      version: "1.0.0",
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
