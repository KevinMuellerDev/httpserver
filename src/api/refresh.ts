import { Request, Response, NextFunction } from "express";
import { getBearerToken, makeJWT } from "./auth.js";
import { getRefreshTokenByProvidedToken } from "../db/queries/refreshToken.js";
import { UnauthorizedError } from "./errors.js";
import { config } from "../config.js";

export const handlerRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providedToken = getBearerToken(req);
        const tokenData = await getRefreshTokenByProvidedToken(providedToken);
        const expiresInSeconds = parseInt(config.jwt.expiresIn);


        if (!tokenData)
            throw new UnauthorizedError('')

        if (tokenData.revokedAt)
            throw new UnauthorizedError('')

        const token = makeJWT(tokenData.userId, expiresInSeconds, config.jwt.secret)

        res.status(200).json({ token: token })

    } catch (error) {
        next(error);
    }


}