import { Router } from "express";
import { optimizeAvatar } from "../libs/sharp";
import { uploadFile } from "../libs/cloudinary";

export const testRoutes = Router();

testRoutes.post("/test/images", async (req, res) => {
  const files = req.files as any;

  const folder = 'test'

  if (!files) return res.json(false);

  const optimizedAsset = await optimizeAvatar(files.avatar.data, { folder })
  const { uploadedFile } = await uploadFile(optimizedAsset.filePath!, { folder })

  res.json(uploadedFile);
});
