import type { Request, Response } from "express";
import User from "../db-models/user";

async function getUserById (req: Request, res: Response) {
  const userId = req.query?.id

  const correctQuery = userId && userId !== ''

  if (!correctQuery) return res.status(400).json('This query params is wrong.')

  try {
    const user = await User.findById(userId)


    res.json(user)
  }
  catch (err) {
    res.status(500).json(err)
  }
}

export { getUserById }