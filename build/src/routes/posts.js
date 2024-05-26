"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_1 = require("../controllers/posts");
const auth_1 = require("../middlewares/auth");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/v1/posts', auth_1.verifySession, posts_1.getPosts);
exports.postsRouter.post('/v1/posts', auth_1.verifySession, posts_1.addPost);
