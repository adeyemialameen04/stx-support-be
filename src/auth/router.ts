import { Hono } from "hono";
import { sign, verify } from "jsonwebtoken";
import { loginSchema } from "./contract";
import { ZodError } from "zod";
import { handleValidation } from "../utils/validation";

export const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  try {
    const data = await c.req.json();
    const credentials = loginSchema.parse(data);
    c.status(200);
    return c.json({ message: "Login successful" });
  } catch (error) {
    return handleValidation(error, c);
  }
});

authRouter.post("/refresh", async (c) => {
  const { refreshToken } = await c.req.json();
  try {
    const decoded = verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { username: string };
    const accessToken = sign(
      { username: decoded.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );
    return c.json({ accessToken });
  } catch (error) {
    c.status(401);
    return c.json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/logout", async (c) => {
  // Implement logout logic (e.g., invalidate refresh token)
  return c.json({ message: "Logged out successfully" });
});
