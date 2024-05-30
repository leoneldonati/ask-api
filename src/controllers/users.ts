import type { Request, Response } from "express";
import { db } from "../db";

async function getUserById(req: Request, res: Response) {
  const userId = req.query?.id;

  const correctQuery = userId && userId !== "";

  if (!correctQuery) return res.status(400).json("This query params is wrong.");

  try {
    const user = await db.execute({
      sql: "SELECT * FROM users WHERE id = $id",
      args: {
        id: userId.toString(),
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

export { getUserById };
