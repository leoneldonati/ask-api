"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post('/v1/auth', auth_1.handleAuth);
