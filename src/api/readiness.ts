import { Request, Response, NextFunction } from "express";


export const handlerReadiness = (req: Request, res: Response, next: NextFunction): void => {
    res.set({
        'Content-Type': 'text/plain'
    });
    res.send('OK');
}