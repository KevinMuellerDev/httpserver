import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getUserByMail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { transformUserData } from "../db/utilities.js";
import { config } from "../config.js";

export const handlerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const expiresInSeconds = parseInt(config.jwt.expiresIn);


        if (!email || !password)
            throw new BadRequestError('Bad Request');


        const userData = await getUserByMail(email);
        const isValid = await checkPasswordHash(password, userData.hashedPassword);

        if (!isValid)
            throw new UnauthorizedError('');

        const accessToken = makeJWT(userData.id, expiresInSeconds, config.jwt.secret)
        const refreshToken = await makeRefreshToken(userData.id);
        const responseUser = transformUserData(userData);

        res.status(200).json({ ...responseUser, token: accessToken, refreshToken });

    } catch (error) {
        next(error);
    }



}