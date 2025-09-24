import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import type { RefreshToken } from "../schema.js";

export async function createRefreshToken(refreshToken: RefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning()

    return result
}


export async function getRefreshTokenByProvidedToken(token: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token))

    return result
}

export async function patchRevokedAtRefreshToken(token: string) {
    const [result] = await db
        .update(refreshTokens)
        .set({ updatedAt: new Date(), revokedAt: new Date() })

    return result
}