"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPostPayload = exports.verifyClientPayload = void 0;
const zod_1 = require("zod");
const payloadObject = (0, zod_1.object)({
    password: (0, zod_1.string)(),
    email: (0, zod_1.string)().email(),
    bio: (0, zod_1.string)(),
    date: (0, zod_1.date)(),
    name: (0, zod_1.string)(),
    username: (0, zod_1.string)(),
    avatar: (0, zod_1.any)(),
});
const verifyClientPayload = (payload, { action }) => {
    try {
        const parsedPayload = action === "login"
            ? payloadObject
                .partial({ bio: true, date: true, name: true, username: true })
                .parse(payload)
            : payloadObject.parse(payload);
        return {
            ok: parsedPayload && true,
            error: null,
        };
    }
    catch (e) {
        return {
            ok: false,
            error: e.issues,
        };
    }
};
exports.verifyClientPayload = verifyClientPayload;
const postPayload = (0, zod_1.object)({
    title: (0, zod_1.string)(),
    content: (0, zod_1.string)(),
    images: (0, zod_1.array)((0, zod_1.object)({})).nullable(),
});
const verifyPostPayload = (payload) => {
    try {
        const parsedPayload = postPayload.parse(payload);
        return {
            ok: true,
            error: null
        };
    }
    catch (err) {
        return {
            ok: false,
            error: err.issues
        };
    }
};
exports.verifyPostPayload = verifyPostPayload;
