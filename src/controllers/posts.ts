import type { Request, Response } from "express";
import Post from '../db-models/post'

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


export {
  getPosts
}