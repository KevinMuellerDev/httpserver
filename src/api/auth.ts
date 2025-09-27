import { compare, genSalt, hash } from "bcrypt"
import { config, getEnvOrThrow } from "../config.js";
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { Request } from "express";
import { UnauthorizedError } from "./errors.js";
import { randomBytes } from "crypto";
import { daysToMilliseconds } from "../db/utilities.js";
import { createRefreshToken } from "../db/queries/refreshToken.js";
import { RefreshToken } from "../db/schema.js";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        if (!password)
            throw new Error('No password provided')
        const saltRounds = await genSalt(parseInt(getEnvOrThrow("SALTROUND")));
        const hashedPassword = await hash(password, saltRounds);

        return hashedPassword
    } catch (error) {
        throw new Error('something went wrong while hashing password')
    }
}

export const checkPasswordHash = async (password: string, hash: string): Promise<boolean> => {
    try {
        if (!password || !hash)
            throw new Error('Hash or Password not provided');
        const isValid = await compare(password, hash);

        return isValid;
    } catch (error) {
        throw new Error('Oops, something went wrong')
    }

}

export type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export const makeJWT = (userID: string, expiresIn: number, secret: string): string => {
    const iat = Math.floor(Date.now() / 1000);
    try {
        const payload: Payload = {
            iss: "chirpy",
            sub: userID,
            iat,
            exp: iat + expiresIn
        }
        const token = jwt.sign(payload, secret)

        return token
    } catch (error) {
        throw new Error('Oops something went wrong')
    }
}

export const validateJWT = (tokenString: string, secret: string): string => {
    try {
        const verification = jwt.verify(tokenString, secret);
        if (typeof (verification) === "string" || !verification.sub)
            throw new Error('JWTPayload is awaited')

        return verification.sub
    } catch (error) {
        throw new UnauthorizedError('Something went wrong')
    }
}


export const getBearerToken = (req: Request): string => {
    const bearer = req.get('Authorization')?.split(' ')[1];

    if (!bearer)
        throw new UnauthorizedError('')

    return bearer
}

export const getAPIKey = (req: Request): string => {
    const key = req.get('Authorization')?.split(' ')[1];

    if (!key)
        throw new UnauthorizedError('')

    return key
}

export const makeRefreshToken = async (id: string) => {
    const randString = randomBytes(256).toString('hex');
    const expirationInMs = new Date().getTime() + daysToMilliseconds(config.jwt.ttl);
    const expirationDate = new Date(expirationInMs);

    const refreshTokenData: RefreshToken = {
        token: randString,
        userId: id,
        expiresAt: expirationDate
    }

    const token = await createRefreshToken(refreshTokenData);


    return token.token
}