import { Router } from "express";
import { getUserById } from "../controllers/users";
import { verifySession } from "../middlewares/auth";

export const usersRouter = Router();

usersRouter.get("/v1/users", verifySession, getUserById);
