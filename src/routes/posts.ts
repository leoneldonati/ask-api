import { Router } from "express";
import { addPost, getPosts } from "../controllers/posts";
import { verifySession } from "../middlewares/auth";

export const postsRouter = Router()

postsRouter.get('/v1/posts', getPosts)
postsRouter.post('/v1/posts', verifySession, addPost)