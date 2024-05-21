"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postModel = new mongoose_1.default.Schema({
    content: String,
    images: {
        type: Array || null
    },
    title: {
        type: String,
        trim: true
    },
    likes: {
        type: (Array)
    },
    comments: {
        type: Array
    },
    owner: {
        type: Object,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.default = mongoose_1.default.model('Post', postModel);
