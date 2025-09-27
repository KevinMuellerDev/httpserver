import { Request, Response, NextFunction } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { createChirp, deleteSingleChirp, getChirpsAsc, getChirpsDesc, getChirpsFromAuthor, getSingleChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";
import { Chirp } from "../db/schema.js";


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

export const handlerGetChirps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorId = req.query.authorId;
        const sort = req.query.sort;

        let chirps: Chirp[] = [];

        if (authorId !== undefined && typeof (authorId) === "string") {
            chirps = await getChirpsFromAuthor(authorId);
        } else if (sort !== undefined && sort === "desc") {
            chirps = await getChirpsDesc();
        } else {
            chirps = await getChirpsAsc();
        }
        console.log()

        res.status(200).json(chirps);
    } catch (error) {
        next(error);
    }
}

export const handlerGetSingleChirp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const param = req.params.chirpID;
        const chirp = await getSingleChirp(param);

        if (!chirp)
            throw new NotFoundError('');

        res.status(200).json(chirp);
    } catch (error) {
        res.status(404).send("Chirp not found");
    }
}

export const handlerDeleteSingleChirp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const param = req.params.chirpID;
        const token = getBearerToken(req);
        const validatedUser = validateJWT(token, config.jwt.secret)

        const singleChirp = await getSingleChirp(param)

        if (singleChirp.userId !== validatedUser)
            throw new ForbiddenError('');

        const deletedChirp = await deleteSingleChirp(param);

        console.table(deletedChirp)

        if (!deletedChirp.body)
            throw new NotFoundError('');

        res.status(204).json({ ok: true })

    } catch (error) {
        next(error);
    }
}