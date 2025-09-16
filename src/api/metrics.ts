import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export const handlerMetrics = (req: Request, res: Response, next: NextFunction): void => {
    res.set({
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.send(`
        <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.fileserverHits} times!</p>
        </body>
        </html>
`);
    next();
}