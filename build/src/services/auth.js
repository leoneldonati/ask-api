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
exports.signup = exports.login = exports.DEFAULT_AVATAR = void 0;
const user_1 = __importDefault(require("../db-models/user"));
const bcrypt_1 = require("../libs/bcrypt");
const jwt_1 = require("../libs/jwt");
const cloudinary_1 = require("../libs/cloudinary");
exports.DEFAULT_AVATAR = "https://res.cloudinary.com/dzmuriaby/image/upload/v1701369252/avatares/ucqpxvyuji2z0gqwbwg9.png";
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    // TODO: implementar funcion para parsear el payload del cliente
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user)
            return {
                status: 401,
                message: "Invalid credentials, please provide correct credentials or sing up.",
            };
        const isMatch = yield (0, bcrypt_1.compare)(password, user.hash);
        if (!isMatch)
            return {
                status: 401,
                message: "Invalid credentials, please provide correct credentials or sing up.",
            };
        const token = (0, jwt_1.signToken)({ user, loggedAt: new Date(Date.now()) });
        return {
            status: 200,
            message: "Login succefully.",
            data: user,
            token
        };
    }
    catch (error) {
        return {
            status: 500,
            error,
            message: "Error on login function.",
        };
    }
});
exports.login = login;
const signup = (_b) => __awaiter(void 0, [_b], void 0, function* ({ payload, avatar }) {
    try {
        const user = yield user_1.default.findOne({ email: payload.email });
        if (user)
            return {
                status: 400,
                message: `This email: @${payload.email}; already exists. Please provide other email.`,
            };
        const hash = yield (0, bcrypt_1.encrypt)(payload.password);
        const { ok, uploadedFile } = yield (0, cloudinary_1.uploadFile)(avatar, {
            folder: "avatares",
        });
        const newUser = new user_1.default({
            name: payload.name,
            username: payload.username,
            bio: payload.bio,
            date: payload.date,
            email: payload.email,
            followed: [],
            followers: [],
            posts: [],
            isVerified: false,
            hash,
            avatar: uploadedFile !== null && uploadedFile !== void 0 ? uploadedFile : { secureUrl: exports.DEFAULT_AVATAR },
        });
        const userSaved = yield newUser.save();
        const token = (0, jwt_1.signToken)({ loggedAt: new Date(Date.now()), user: userSaved });
        return {
            status: 200,
            message: "Good! You have created an account succefully!",
            data: token,
        };
    }
    catch (e) {
        return {
            status: 500,
            message: "Error on signun function.",
            error: e,
        };
    }
});
exports.signup = signup;
