"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = require("../middlewares/auth");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get('/v1/users', auth_1.verifySession, users_1.getUserById);
