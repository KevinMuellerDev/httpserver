import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export const handlerReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    config.api.fileserverHits = 0;
    res.set({
      "Content-Type": "text/plain",
    });
    res.write("Hits have been reset to 0");
    res.end();
  } catch (error) {
    next(error);
  }
};
