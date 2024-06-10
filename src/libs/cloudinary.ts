import type { FileArray } from "express-fileupload";
import { v2 as cld } from "cloudinary";
import { DEFAULT_AVATAR } from "../services/auth";
import { cldKey, cldName, cldSecret } from "../config";
import { rm } from "node:fs/promises";

cld.config({
  api_key: cldKey,
  cloud_name: cldName,
  api_secret: cldSecret,
});

type UploadFileFn = (
  filePath: string,
  { folder }: { folder: string }
) => Promise<{
  error?: any;
  uploadedFile: { secureUrl: string; publicId?: string };
}>;

const uploadFile: UploadFileFn = async (filePath, { folder }) => {
  try {
    const uploadResponse = await cld.uploader.upload(filePath, {
      folder,
    });

    return {
      uploadedFile: {
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      },
    };
  } catch (e) {
    return {
      error: e,
      uploadedFile: {
        secureUrl: DEFAULT_AVATAR,
      },
    };
  } finally {
    await rm(filePath);
  }
};

const uploadMultipleFiles = async (
  filesPaths: string[],
  { folder }: { folder: string }
) => {

  try {
    const promises = filesPaths.map(filePath => uploadFile(filePath, { folder }).then(({ uploadedFile }) => ({ secureUrl: uploadedFile.secureUrl, publicId: uploadedFile.publicId })))

    const resolved = await Promise.all(promises)
    return {
      ok: true,
      savedFiles: resolved
    }
  }
  catch (error) {
    return {
      ok: false,
      error
    }
  }
};

export { uploadFile, uploadMultipleFiles };
