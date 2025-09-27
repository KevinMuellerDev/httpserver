import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";

export async function createChirp(chirp: Chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning()

    return result
}

export async function getChirpsAsc() {
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));

    return result
}

export async function getChirpsDesc() {
    const result = await db.select().from(chirps).orderBy(desc(chirps.createdAt));

    return result
}

export async function getSingleChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));

    return result
}

export async function deleteSingleChirp(id: string,) {
    const [result] = await db.delete(chirps).where(eq(chirps.id, id)).returning();

    return result
}

export async function getChirpsFromAuthor(userId: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId))
        .orderBy(asc(chirps.createdAt));

    return result
}