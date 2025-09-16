import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export const handlerReset = (req: Request, res: Response, next: NextFunction): void => {
    config.fileserverHits = 0;
    res.set({
        'Content-Type': 'text/plain'
    });
    res.write('Hits have been reset to 0');
    res.end();
}