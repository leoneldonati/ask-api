import type { Response, NextFunction } from "express";
import type { ExtendedReq } from "../types";
import { verifyToken } from "../libs/jwt";
import { COOKIE_CONFIG, COOKIE_NAME } from "../config";

function verifySession(req: ExtendedReq, res: Response, next: NextFunction) {
  const token = req.cookies?.session;

  if (!token) {
    res.cookie(COOKIE_NAME, "", COOKIE_CONFIG);
    return res.status(401).json("Session expired. 1");
  }

  const decodedToken = verifyToken(token) as { logged: Date; user: any };

  if (!decodedToken) {
    res.cookie(COOKIE_NAME, "", { expires: new Date(0) });
    return res.status(401).json("Session expired. 2");
  }
  req.user = decodedToken.user;

  next();
}

export { verifySession };
