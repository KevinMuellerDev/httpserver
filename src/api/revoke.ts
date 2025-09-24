import { Request, Response, NextFunction } from "express";
import { getBearerToken } from "./auth.js";
import { patchRevokedAtRefreshToken } from "../db/queries/refreshToken.js";

export const handlerRevokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providedToken = getBearerToken(req);
        await patchRevokedAtRefreshToken(providedToken)

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}