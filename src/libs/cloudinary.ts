import type { FileArray } from "express-fileupload";
import {
  v2 as cld
} from 'cloudinary'
import { DEFAULT_AVATAR } from "../services/auth";
import { cldKey, cldName, cldSecret } from "../config";


cld.config({
  api_key: cldKey,
  cloud_name: cldName,
  api_secret: cldSecret,
  secure: true  
})


type UploadFileFn = (
  avatar: FileArray,
  { folder }: { folder: string }
) => Promise<{ error?: any; uploadedFile: { secureUrl: string; publicId?:string } }>;

const uploadFile: UploadFileFn = async (avatar, { folder }) => {

  if (!avatar) return {
    uploadedFile: {
      secureUrl: DEFAULT_AVATAR
    }
  }
  const filePath = Array.isArray(avatar) ? avatar[0] : avatar
  try {
    const uploadResponse = await cld.uploader.upload(filePath.tempFilePath, { folder })

    return {
      uploadedFile: {
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      }
    }

  }
  catch (e) {
    return {
      error: e,
      uploadedFile: {
        secureUrl: DEFAULT_AVATAR
      }
    }
  }


};

export { uploadFile };
