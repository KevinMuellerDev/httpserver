import { NextFunction, Request, Response } from "express";
import { getEnvOrThrow } from "../config.js";
import { createUser, deleteUsers } from "../db/queries/users.js";
import { ForbiddenError } from "./errors.js";

export const handlerCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email)
            throw new Error('')

        const newUser = await createUser(req.body);
        console.table(newUser)
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}
