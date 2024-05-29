import type { Request, Response } from "express";
import { verifyPostPayload } from "../libs/zod";
import { db } from "../db";
import type { ExtendedReq, DB_QUERYS, Post } from "../types";
import post from "../db-models/post";

async function getPosts(req: Request, res: Response) {
  const q = req.query?.q;

  const isCorrectQuery = q && q !== "" && !Number.isNaN(q);

  if (!isCorrectQuery)
    return res.status(400).json({
      message: 'The query param "q" is not correct',
    });

  const query = `SELECT 
    posts.id AS post_id,
    posts.content AS post_content,
    posts.createdAt AS post_created_at,
    posts.updatedAt AS post_updated_at,
    JSON_OBJECT(
        'id', users.id,
        'name', users.name,
        'email', users.email,
        'bio', users.bio,
        'avatar', users.avatar
    ) AS owner,
    JSON_GROUP_ARRAY(likes.user_id) AS like_user_ids,
    JSON_GROUP_ARRAY(
        JSON_OBJECT(
            'id', comments.id,
            'user_id', comments.user_id,
            'content', comments.content,
            'createdAt', comments.createdAt,
            'updatedAt', comments.updatedAt
        )
    ) AS comments
  FROM 
    posts
  JOIN 
    users ON posts.userid = users.id
  LEFT JOIN 
    likes ON posts.id = likes.post_id
  LEFT JOIN 
    comments ON posts.id = comments.post_id
  GROUP BY 
    posts.id
  ORDER BY 
    posts.createdAt DESC
  LIMIT 
    $q;
`;

  try {
    const result = await db.execute({
      sql: query,
      args: {
        q: Number(q) ?? 15,
      },
    });

    const posts = result.rows.map((row) => ({
      ...row,
      comments: JSON.parse(row.comments! as string)[0].id === null ? [] : JSON.parse(row.comments! as string),
      owner: JSON.parse(row.owner! as string),
      like_user_ids:
        JSON.parse(row.like_user_ids! as string)[0] === null
          ? []
          : JSON.parse(row.like_user_ids! as string),
    }));

    console.log(posts)
    return res.json(posts);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error on server: post get function",
      error: e,
    });
  }
}

type PostPayload = {
  title: string;
  content: string;
  images: File[] | null;
};

async function addPost(req: ExtendedReq, res: Response) {
  const postPayload = req.body as PostPayload;
  const { ok, error } = verifyPostPayload(postPayload);

  if (!ok)
    return res.status(404).json({
      message: "Wrong post format!",
      error,
    });

  try {
    const result = await db.execute({
      sql: "INSERT INTO posts (id, userid, content, createdAt) VALUES ($id, $userid, $content, $createdAt)",
      args: {
        id: crypto.randomUUID(),
        userid: req.user.id,
        content: postPayload.content,
      },
    });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
}

export { getPosts, addPost };
