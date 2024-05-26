"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const auth_1 = require("../services/auth");
const config_1 = require("../config");
cloudinary_1.v2.config({
    api_key: config_1.cldKey,
    cloud_name: config_1.cldName,
    api_secret: config_1.cldSecret,
    secure: true
});
const uploadFile = (avatar_1, _a) => __awaiter(void 0, [avatar_1, _a], void 0, function* (avatar, { folder }) {
    if (!avatar)
        return {
            ok: true,
            uploadedFile: {
                secureUrl: auth_1.DEFAULT_AVATAR
            }
        };
    const filePath = Array.isArray(avatar) ? avatar[0] : avatar;
    try {
        const uploadResponse = yield cloudinary_1.v2.uploader.upload(filePath.tempFilePath, { folder });
        return {
            ok: true,
            uploadedFile: {
                secureUrl: uploadResponse.secure_url,
                publicId: uploadResponse.public_id
            }
        };
    }
    catch (e) {
        return {
            ok: false,
            error: e,
            uploadedFile: {
                secureUrl: auth_1.DEFAULT_AVATAR
            }
        };
    }
});
exports.uploadFile = uploadFile;
