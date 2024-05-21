"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretJwtWord = exports.dbUser = exports.dbPass = exports.dbName = exports.port = exports.clientHost = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.clientHost = process.env.CLIENT_HOST;
exports.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
exports.dbName = process.env.DB_NAME;
exports.dbPass = process.env.DB_PASS;
exports.dbUser = process.env.DB_USER;
exports.secretJwtWord = process.env.SECRET_JWT;
