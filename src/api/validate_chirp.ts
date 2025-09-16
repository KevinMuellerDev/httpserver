import { Request, Response, NextFunction } from "express";


export const handlerValidateChirp = (req: Request, res: Response, next: NextFunction) => {
    let body = "";
    let stringifiedResponse = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        res.header('Content-Type', 'application/json');
        try {
            const parsedBody = JSON.parse(body);
            if (parsedBody.body.length > 140) {
                stringifiedResponse = JSON.stringify({ error: "Chirp is too long" })
                res.status(400).send(stringifiedResponse)
            } else {
                stringifiedResponse = JSON.stringify({ valid: true })
                res.status(200).send(stringifiedResponse);
            }
        } catch (error) {
            res.status(400).send({ error: "Something went wrong" })
        }
    })
}