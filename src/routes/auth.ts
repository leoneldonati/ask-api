import { Router } from "express";
import { checkSession, closeSession, handleAuth } from "../controllers/auth";
import { verifySession } from "../middlewares/auth";

export const authRoutes = Router();

authRoutes.post("/v1/auth", handleAuth);
authRoutes.get("/v1/logout", closeSession);
authRoutes.get("/v1/check", verifySession, checkSession);
