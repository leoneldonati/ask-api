import { Router } from "express";
import { getPosts } from "../controllers/posts";

export const postsRouter = Router()

postsRouter.get('/v1/posts', getPosts)