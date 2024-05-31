import type { FileArray } from "express-fileupload";
import { v2 as cld } from "cloudinary";
import { DEFAULT_AVATAR } from "../services/auth";
import { cldKey, cldName, cldSecret } from "../config";
import { rm } from "node:fs/promises";

cld.config({
  api_key: cldKey,
  cloud_name: cldName,
  api_secret: cldSecret
});

type UploadFileFn = (
  avatar: FileArray,
  { folder }: { folder: string }
) => Promise<{
  error?: any;
  uploadedFile: { secureUrl: string; publicId?: string };
}>;

const uploadFile: UploadFileFn = async (file, { folder }) => {
  if (!file)
    return {
      uploadedFile: {
        secureUrl: DEFAULT_AVATAR,
      },
    };

    const fileObj = Object.values(file)[0] as any
  try {
    const uploadResponse = await cld.uploader.upload(fileObj.tempFilePath, {
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
    await rm(`./temp-files`, { recursive: true });
  }
};

const uploadMultipleFiles = async (
  files: FileArray,
  { folder = "posts-files" }: { folder: string }
) => {
  try {
    if (Array.isArray(files)) {
      const promises = files.map((file) => {
        return cld.uploader
          .upload(file.tempFilePath, { folder })
          .then(({ secure_url: secureUrl }) => {
            return {
              secureUrl,
            };
          });
      });

      return Promise.all(promises);
    }
  } catch (e) {
    return {
      secureUrl: "",
    };
  } finally {
    await rm(`./temp-files`, { recursive: true });
  }
};

export { uploadFile, uploadMultipleFiles };
