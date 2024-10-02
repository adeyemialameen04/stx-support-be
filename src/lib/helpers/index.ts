import { ZodType } from "zod";

export const accessTokenSecurity = [{ AccessTokenBearer: [] }];
export const refreshTokenSecurity = [{ RefreshTokenBearer: [] }];

export const jsonContent = (schema: ZodType) => {
  return {
    "application/json": {
      schema,
    },
  };
};
