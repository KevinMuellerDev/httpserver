import { Request, Response, NextFunction } from "express";


export const handlerReadiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.set({
            'Content-Type': 'text/plain'
        });
        res.send('OK');
    } catch (error) {
        next(error);
    };

}