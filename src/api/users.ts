import { NextFunction, Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "./auth.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { config } from "../config.js";



export const handlerCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!req.body.email || !req.body.password)
            throw new Error('')

        const hashedPassword = await hashPassword(password);
        const newUser = await createUser({ email, hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const handlerPutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const providedToken = getBearerToken(req);
        const tokenUser = validateJWT(providedToken, config.jwt.secret);

        if (!email || !password)
            throw new BadRequestError('');

        if (!tokenUser)
            throw new UnauthorizedError('');

        const hashedPassword = await hashPassword(password);

        const result = await updateUser(email, hashedPassword, tokenUser)
        console.log(result)
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}