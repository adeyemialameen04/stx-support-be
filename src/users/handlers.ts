import { eq } from "drizzle-orm";
import { getAllUsers, getUser } from "./routes";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { AppRouteHandler } from "@/lib/types";

export const getUserHandler: AppRouteHandler<typeof getUser> = async (c) => {
  const { id } = c.req.valid("param");
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .limit(1);

  if (!user) {
    return c.json(
      { status: 404, detail: "User not found", error: "Not found" },
      404,
    );
  }

  return c.json(user, 200);
};

export const getAllUsersHandler: AppRouteHandler<typeof getAllUsers> = async (
  c,
) => {
  const users = await db.select().from(userTable);
  return c.json(users, 200);
};
