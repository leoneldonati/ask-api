import type { Response, NextFunction } from "express";
import type { ExtendedReq } from "../types";
import { verifyToken } from "../libs/jwt";


function verifySession(req: ExtendedReq, res: Response, next: NextFunction) {
  const token = req.cookies?.session;

  console.log(token)

  if (!token) return res.status(401).json("Session expired.");

  const decodedToken = verifyToken(token) as {logged: Date; user: any}

  console.log(decodedToken)
  if (!decodedToken) return res.status(401).json("Session expired.");

  req.user = decodedToken.user

  next()
}

export { verifySession };
