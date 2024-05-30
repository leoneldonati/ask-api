import type { Request, Response } from "express";
import { verifyPostPayload } from "../libs/zod";
import { db } from "../db";
import type { ExtendedReq } from "../types";
import { uploadFile, uploadMultipleFiles } from "../libs/cloudinary";

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
      'username', users.username,
      'email', users.email,
      'bio', users.bio,
      'avatar', users.avatar
  ) AS owner,
  JSON_GROUP_ARRAY(DISTINCT likes.user_id) AS like_user_ids,
  JSON_GROUP_ARRAY(
      DISTINCT JSON_OBJECT(
          'id', comments.id,
          'user_id', comments.user_id,
          'content', comments.content,
          'createdAt', comments.createdAt,
          'updatedAt', comments.updatedAt
      )
  ) AS comments,
  JSON_GROUP_ARRAY(
      DISTINCT JSON_OBJECT(
          'id', post_files.id,
          'secure_url', post_files.secure_url
      )
  ) AS files
FROM 
  posts
JOIN 
  users ON posts.userid = users.id
LEFT JOIN 
  likes ON posts.id = likes.post_id
LEFT JOIN 
  comments ON posts.id = comments.post_id
LEFT JOIN 
  post_files ON posts.id = post_files.post_id
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

    return res.json(posts);
  } catch (e) {
    return res.status(500).json({
      message: "Error on server: post get function",
      error: e,
    });
  }
}

async function addPost(req: ExtendedReq, res: Response) {
  const postPayload = req.body;
  const files = req.files
  const { ok, error } = verifyPostPayload(postPayload);
  const postId = crypto.randomUUID()

  if (!ok)
    return res.status(404).json({
      message: "Wrong post format!",
      error,
    });
  const hasMultipleImages = files !== undefined && files?.files !== undefined && Array.isArray(files) && files.length > 1
  try {

    // guardar post en bdd
    await db.execute({
      sql: "INSERT INTO posts (id, userid, content) VALUES ($id, $userid, $content)",
      args: {
        id: postId,
        userid: req.user.id,
        content: postPayload.content,
      },
    });

    if (files && files !== null) {

      const uploadedFile = hasMultipleImages ? await uploadMultipleFiles(files, {folder: 'post-images'}) : (await uploadFile(files!, {folder: 'post-images'})).uploadedFile

      if (Array.isArray(uploadedFile) && uploadedFile.length > 1) {

        uploadedFile.forEach(file => {
          
          db.execute({
            sql: 'INSERT INTO post_files (id, post_id, secure_url) VALUES ($id, $post_id, $secure_url)',
            args: {
              id: crypto.randomUUID(),
              post_id: postId,
              secure_url: file.secureUrl
            }
          })
            .then(({rowsAffected}) => {
            })
            .catch((err) => {})
        })
      }

      await db.execute({
        sql: 'INSERT INTO post_files (id, post_id, secure_url) VALUES ($id, $post_id, $secure_url)',
        args: {
          id: crypto.randomUUID(),
          post_id: postId,
          secure_url: uploadedFile !== undefined && !Array.isArray(uploadedFile) &&  uploadedFile.secureUrl
        }
      })
    }
    

    res.json({});
  } catch (err) {
    res.status(500).json({ err });
  }
}

export { getPosts, addPost };
