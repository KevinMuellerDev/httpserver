import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const middlewareLogResponses: Middleware = (req, res, next) => {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (statusCode !== 200)
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    });
    next();
};

export const middlewareMetricsInc: Middleware = (req, res, next) => {
    config.fileserverHits++
    next();
}