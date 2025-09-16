import { Request, Response, NextFunction } from "express";

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


export const handlerValidateChirp = (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.body.body.length > 140) {
            res.status(400).send({ error: "Chirp is too long" })
        } else {
            const cleanedBody = checkForProfane(req.body);
            res.status(200).send(cleanedBody);
        }
    } catch (error) {
        res.status(400).send({ error: "Something went wrong" })
    }

}