import type { FileArray } from "express-fileupload";
import {
  v2 as cld
} from 'cloudinary'
import { DEFAULT_AVATAR } from "../services/auth";


type UploadFileFn = (
  avatar: FileArray,
  { folder }: { folder: string }
) => Promise<{ ok: boolean; error?: any; uploadedFile?: any }>;

const uploadFile: UploadFileFn = async (avatar, { folder }) => {

  if (!avatar) return {
    ok: true,
    uploadedFile: {
      secureUrl: DEFAULT_AVATAR
    }
  }
  const filePath = Array.isArray(avatar) ? avatar[0] : avatar
  try {
    const uploadResponse = await cld.uploader.upload(filePath.tempFilePath, { folder })

    return {
      ok: true,
      uploadedFile: {
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      }
    }

  }
  catch (e) {
    return {
      ok: false,
      error: e,
      uploadedFile: {
        secureUrl: DEFAULT_AVATAR
      }
    }
  }


};

export { uploadFile };
