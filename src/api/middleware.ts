import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errors.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type ErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => void;

export const middlewareLogResponses: Middleware = (req, res, next) => {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (statusCode !== 200)
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    });
    next();
};

export const middlewareMetricsInc: Middleware = (req, res, next) => {
    config.api.fileserverHits++
    next();
}

export const errorHandler: ErrorMiddleware = (err, req, res, next) => {

    if (err instanceof BadRequestError) {
        res.status(400).send({ error: "Chirp is too long. Max length is 140" });
    } else if (err instanceof UnauthorizedError) {
        res.status(401).send({ error: "Unauthorized" });
    } else if (err instanceof ForbiddenError) {
        res.status(403).send({ error: "Forbidden" })
    } else if (err instanceof NotFoundError) {
        res.status(404).send("File not Found")
    } else {
        res.status(500).send({ error: "Something went wrong on our end" });
    }


};