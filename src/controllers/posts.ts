import type { Request, Response } from "express";
import Post from '../db-models/post'
import { verifyPostPayload } from "../libs/zod";
import type { ExtendedReq } from "../types";

async function getPosts (req: Request, res: Response) {
  const q = req.query?.q

  const isCorrectQuery = q && q !== '' && !Number.isNaN(q)

  if (!isCorrectQuery) return res.status(400).json({
    message: 'The query param "q" is not correct'
  })

  try {
    const posts = await Post.find().limit(Number(q))
    return res.json(posts)
  }
  catch (e) {
    return res.status(500).json({
      message: 'Error on server: post get function',
      error: e
    })
  }
}

type PostPayload = {
  title: string;
  content: string;
  images: File[] | null;

}

async function addPost (req: ExtendedReq, res: Response) {
  const postPayload = req.body as PostPayload
  const {ok, error} = verifyPostPayload(postPayload)

  if (!ok) return res.status(404).json({
    message: 'Wrong post format!',
    error
  })

  const newPost = new Post({
    title: postPayload.title,
    content: postPayload.content,
    images: [{}],
    comments: [],
    likes: [],
    owner: req.user
  })
  try {

    const postSaved = await newPost.save()

    res.json(postSaved)
  }
  catch (err) {
    res.status(500).json({ err })
  }
}

export {
  getPosts,
  addPost
}