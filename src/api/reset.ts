import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./errors.js";
import { deleteUsers } from "../db/queries/users.js";

export const handlerReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    config.api.fileserverHits = 0;


    if (config.api.platform !== "dev")
      throw new ForbiddenError("Reset is only allowed in dev environment.");

    await deleteUsers();
    res.status(200).json({ ok: true })
  } catch (error) {
    next(error);
  }
};
