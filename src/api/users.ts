import { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "./auth.js";


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
