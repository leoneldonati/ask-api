"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./routes/auth");
const config_1 = require("./config");
const posts_1 = require("./routes/posts");
exports.app = (0, express_1.default)();
exports.app.disable('x-powered-by');
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use((0, cors_1.default)({
    origin: config_1.clientHost,
    credentials: true
}));
exports.app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: './temp-files' }));
exports.app.use(auth_1.authRoutes);
exports.app.use(posts_1.postsRouter);
