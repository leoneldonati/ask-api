"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    hash: {
        type: String,
        trim: false
    },
    bio: {
        type: String,
        trim: true
    },
    followers: {
        type: [mongoose_1.default.Schema.ObjectId],
    },
    followed: {
        type: [mongoose_1.default.Schema.ObjectId]
    },
    date: {
        type: Date
    },
    posts: {
        type: [{}]
    },
    isVerified: {
        type: Boolean
    },
    avatar: {
        type: {
            secureUrl: String,
            publicId: String || undefined
        }
    }
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = mongoose_1.default.model('User', userModel);
