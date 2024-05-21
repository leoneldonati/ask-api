"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const ms_1 = __importDefault(require("ms"));
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, config_1.secretJwtWord, { expiresIn: (0, ms_1.default)('30m') });
exports.signToken = signToken;
const verifyToken = (token) => jsonwebtoken_1.default.verify(token, config_1.secretJwtWord);
exports.verifyToken = verifyToken;
