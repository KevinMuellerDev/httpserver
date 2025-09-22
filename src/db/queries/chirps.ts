import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";

export async function createChirp(chirp: Chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning()

    return result
}

export async function getChirps() {
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt))
    console.table(result);

    return result
}

export async function getSingleChirp(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    console.table(result);

    return result
}