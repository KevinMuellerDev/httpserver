import { compare, genSalt, hash } from "bcrypt"
import { getEnvOrThrow } from "../config.js";
import { JwtPayload, sign, verify } from 'jsonwebtoken'

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
        const token = sign(payload, secret)

        return token
    } catch (error) {
        throw new Error('Oops something went wrong')
    }
}

export const validateJWT = (tokenString: string, secret: string): string => {
    try {
        const verification = verify(tokenString, secret);
        if (typeof (verification) === "string" || !verification.sub)
            throw new Error('JWTPayload is awaited')

        return verification.sub
    } catch (error) {
        throw new Error('Something went wrong')
    }
}
