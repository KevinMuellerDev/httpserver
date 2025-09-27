import { db } from "../index.js";
import { NewUser, users, UserWithoutHash } from "../schema.js";
import { eq } from "drizzle-orm";
import { transformUserData } from "../utilities.js";

export async function createUser(user: NewUser): Promise<UserWithoutHash> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  const returningResult = transformUserData(result)

  return returningResult;
}


export async function deleteUsers() {
  await db.delete(users)
}

export async function getUserByMail(email: string) {
  const [result] = await db.select().from(users).where(eq(users.email, email));

  return result
}

export async function updateUser(email: string, hashedPassword: string, userID: string) {
  const [result] = await db
    .update(users)
    .set({ email, hashedPassword })
    .where(eq(users.id, userID))
    .returning();

  return result
}

export async function updateUserChirpyRed(id: string) {
  const [result] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, id))
    .returning();

  return result
}