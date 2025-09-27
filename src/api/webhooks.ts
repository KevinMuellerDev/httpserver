import type { Request, Response, NextFunction } from "express";
import { updateUserChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "./auth.js";
import { config } from "../config.js";

export const handlerSetChirpyRed = async (req: Request, res: Response, next: NextFunction) => {
    type Params = {
        event: string;
        data: Data;
    }
    type Data = {
        userId: string;
    }

    try {
        const params: Params = req.body;

        const apiKey = getAPIKey(req);


        if (apiKey !== config.api.polka_key) {
            res.status(401).end();
            return
        }

        if (params.event !== "user.upgraded") {
            res.status(204).end();
            return
        }

        if (!params.data.userId) {
            res.status(400).end();
            return
        }

        const userData = await updateUserChirpyRed(params.data.userId);

        if (!userData) {
            res.status(404).end();
            return
        }


        res.status(204).end();

    } catch (error) {
        next(error);
    }
}