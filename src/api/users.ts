import { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";


export const handlerCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email)
            throw new Error('')

        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}
