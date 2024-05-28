import type { Request, Response } from "express";
import Post from '../db-models/post'
import { verifyPostPayload } from "../libs/zod";
import type { ExtendedReq } from "../types";
import { db } from "../db";

async function getPosts (req: Request, res: Response) {
  const q = req.query?.q

  const isCorrectQuery = q && q !== '' && !Number.isNaN(q)

  if (!isCorrectQuery) return res.status(400).json({
    message: 'The query param "q" is not correct'
  })

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM posts LIMIT $q',
      args: {
        q: Number(q) ?? 15
      }
    })
    console.log(result.rows)
    return res.json(result.rows)
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

  
  try {
    const result = await db.execute({
      sql: 'INSERT INTO posts (id, userid, content, date) VALUES ($id, $userid, $content, $date)',
      args: {
        id: crypto.randomUUID(),
        userid: req.user.id,
        content: postPayload.content,
        date: new Date()
      }
  })
  
    res.json(result.rows[0])
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ err })
  }
}

export {
  getPosts,
  addPost
}