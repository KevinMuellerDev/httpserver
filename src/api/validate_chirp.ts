import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "./errors.js";

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


    return { cleanedBody: body.body }
}


export const handlerValidateChirp = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.body.body.length > 140) {
            throw new BadRequestError("test");
        } else {
            const cleanedBody = checkForProfane(req.body);
            res.status(200).send(cleanedBody);
        }
    } catch (error) {
        next(error);
    }

}