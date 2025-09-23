import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import { getUserByMail } from "../db/queries/users.js";
import { checkPasswordHash } from "./auth.js";
import { transformUserData } from "../db/utilities.js";

export const handlerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password)
            throw new BadRequestError('Bad Request');
        const userData = await getUserByMail(email);
        console.log(userData);
        const isValid = await checkPasswordHash(password, userData.hashedPassword);

        if (!isValid)
            throw new UnauthorizedError('');

        const responseuser = transformUserData(userData);

        res.status(200).json(responseuser);

    } catch (error) {
        next(error);
    }



}