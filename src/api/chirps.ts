import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors.js";
import { createChirp, getChirps, getSingleChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { getUserByMail } from "src/db/queries/users.js";

type resBody = {
    body: string;
}

const profanityList = ['kerfuffle', 'sharbert', 'fornax']

const checkForProfane = (body: resBody) => {

    profanityList.forEach((profanity) => {
        if (body.body.toLocaleLowerCase().includes(profanity)) {
            const words = body.body.split(' ');
            const cleanedWords = words.map(word =>
                word.toLocaleLowerCase() === profanity ? '****' : word
            );
            body.body = cleanedWords.join(' ');
        }
    })


    return body.body
}


export const handlerCreateChirp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getBearerToken(req);
        const user = validateJWT(token, config.jwt.secret);


        const body = req.body
        body.userId = user;

        if (body.body.length > 140)
            throw new BadRequestError("test");

        body.body = checkForProfane(body);

        const newChirp = await createChirp(body);

        res.status(201).json(newChirp);

    } catch (error) {
        next(error);
    }
}

export const handlerGetChirps = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const chirps = await getChirps();
        res.status(200).json(chirps);
    } catch (error) {
        next(error);
    }
}

export const handlerGetSingleChirp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const param = req.params.chirpID;
        const chirp = await getSingleChirp(param);

        res.status(200).json(chirp);
    } catch (error) {
        res.status(404).send("Chirp not found");
    }
}