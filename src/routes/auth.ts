import { Router } from "express";
import { handleAuth } from "../controllers/auth";

export const authRoutes = Router()

authRoutes.post('/v1/auth', handleAuth)