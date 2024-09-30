import { Hono } from "hono";
import { sign, verify } from "jsonwebtoken";

export const authRouter = new Hono();

authRouter.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  // Validate credentials (replace with your actual authentication logic)
  if (username === "user" && password === "password") {
    const accessToken = sign({ username }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
    const refreshToken = sign(
      { username },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" },
    );
    return c.json({ accessToken, refreshToken });
  }
  c.status(401);
  return c.json({ error: "Invalid credentials" });
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
