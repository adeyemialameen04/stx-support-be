import { OpenAPIHono } from "@hono/zod-openapi";
import { getUser } from "./routes";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users as userTable } from "../db/schema/users";

const route = new OpenAPIHono();
const router = route.openapi(getUser, async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(user, 200);
});
export default router;
