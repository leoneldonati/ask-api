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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPost = exports.getPosts = void 0;
const post_1 = __importDefault(require("../db-models/post"));
const zod_1 = require("../libs/zod");
function getPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const q = (_a = req.query) === null || _a === void 0 ? void 0 : _a.q;
        const isCorrectQuery = q && q !== '' && !Number.isNaN(q);
        if (!isCorrectQuery)
            return res.status(400).json({
                message: 'The query param "q" is not correct'
            });
        try {
            const posts = yield post_1.default.find().limit(Number(q));
            return res.json(posts);
        }
        catch (e) {
            return res.status(500).json({
                message: 'Error on server: post get function',
                error: e
            });
        }
    });
}
exports.getPosts = getPosts;
function addPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postPayload = req.body;
        const { ok, error } = (0, zod_1.verifyPostPayload)(postPayload);
        if (!ok)
            return res.status(404).json({
                message: 'Wrong post format!',
                error
            });
        try {
            const newPost = new post_1.default({
                title: postPayload.title,
                content: postPayload.content,
                images: [],
                comments: [],
                likes: [],
                owner: req.user
            });
            const postSaved = yield newPost.save();
            res.json(postSaved);
        }
        catch (err) {
            res.status(500).json({ err });
        }
    });
}
exports.addPost = addPost;
