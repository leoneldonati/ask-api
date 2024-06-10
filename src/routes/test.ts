import { Router } from "express";
import { optimizeAvatar } from "../libs/sharp";
import { uploadFile, uploadMultipleFiles } from "../libs/cloudinary";

export const testRoutes = Router();

testRoutes.post("/test/images", async (req, res) => {
  const files = req.files as any;

  const folder = 'test'

  if (!files) return res.json(false);

  const { ok, filesPaths, error } = await optimizeAvatar(files.avatar.data, { folder: 'avatares' })
  
  if (!ok) return res.status(400).json(error)
  const {ok: OK, savedFiles, error: err} = await uploadMultipleFiles(filesPaths!, {folder})

  const avatar = {
    optimized: savedFiles![0],
    original: savedFiles![1]
  }
  res.json({ OK, avatar, err })
});

