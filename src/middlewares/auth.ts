import type { Response, NextFunction } from "express";
import type { ExtendedReq } from "../types";
import { verifyToken } from "../libs/jwt";


function verifySession(req: ExtendedReq, res: Response, next: NextFunction) {
  const token = req.cookies?.session;

  if (!token) return res.status(401).json("Session expired. 1");

  const decodedToken = verifyToken(token) as {logged: Date; user: any}

  if (!decodedToken) return res.status(401).json("Session expired. 2");

  req.user = decodedToken.user

  next()
}

export { verifySession };
