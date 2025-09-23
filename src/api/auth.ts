import { compare, genSalt, hash } from "bcrypt"
import { getEnvOrThrow } from "../config.js";

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