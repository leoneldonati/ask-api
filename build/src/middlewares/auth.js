"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const jwt_1 = require("../libs/jwt");
function verifySession(req, res, next) {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.session;
    if (!token)
        return res.status(401).json("Session expired. 1");
    const decodedToken = (0, jwt_1.verifyToken)(token);
    if (!decodedToken)
        return res.status(401).json("Session expired. 2");
    req.user = decodedToken.user;
    next();
}
exports.verifySession = verifySession;
