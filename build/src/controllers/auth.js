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
exports.handleAuth = void 0;
const auth_1 = require("../services/auth");
const config_1 = require("../config");
const zod_1 = require("../libs/zod");
const ms_1 = __importDefault(require("ms"));
var QUERY_TYPE;
(function (QUERY_TYPE) {
    QUERY_TYPE["LOGIN"] = "login";
    QUERY_TYPE["SIGN_UP"] = "signup";
})(QUERY_TYPE || (QUERY_TYPE = {}));
const HALF_HOUR = new Date(Date.now() + (0, ms_1.default)('30m'));
const COOKIE_NAME = 'session';
const COOKIE_CONFIG = {
    domain: config_1.clientHost,
    expires: HALF_HOUR,
    httpOnly: true,
    secure: true
};
function handleAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const queryType = (_a = req.query) === null || _a === void 0 ? void 0 : _a.type;
        const userPayload = req.body;
        const isCorrectQuery = queryType && queryType !== '' && queryType === QUERY_TYPE.LOGIN || queryType === QUERY_TYPE.SIGN_UP;
        if (!isCorrectQuery)
            return res.status(400).json({
                message: 'This query is wrong, please provide a correct type of query.',
                isCorrectQuery
            });
        const { ok, error } = (0, zod_1.verifyClientPayload)(Object.assign(Object.assign({}, userPayload), { date: userPayload.date ? new Date(userPayload.date) : undefined }), { action: queryType });
        if (!ok)
            return res.status(400).json({
                message: 'You must provide a correct data format.',
                error
            });
        const { email, password } = userPayload;
        try {
            // SI EL USUARIO QUIERE LOGUEARSE
            if (queryType.toString() === QUERY_TYPE.LOGIN) {
                const loginResponse = yield (0, auth_1.login)({ email, password });
                if (loginResponse.status > 299)
                    return res.status(loginResponse.status).json({ message: loginResponse.message, error: loginResponse === null || loginResponse === void 0 ? void 0 : loginResponse.error });
                res.cookie(COOKIE_NAME, loginResponse.token, COOKIE_CONFIG);
                return res.json({ message: loginResponse.message, user: loginResponse.data });
            }
            // SI EL USUARIO QUIERE CREARSE UNA CUENTA
            if (queryType.toString() === QUERY_TYPE.SIGN_UP) {
                const signUpResponse = yield (0, auth_1.signup)({ payload: Object.assign(Object.assign({}, userPayload), { date: new Date(userPayload.date) }), avatar: req.files });
                if (signUpResponse.status > 299)
                    return res.status(signUpResponse.status).json({ message: signUpResponse.message, error: signUpResponse === null || signUpResponse === void 0 ? void 0 : signUpResponse.error });
                res.cookie(COOKIE_NAME, signUpResponse.token, COOKIE_CONFIG);
                return res.json({ message: signUpResponse.message });
            }
        }
        catch (error) {
            return res.status(500).json({
                message: 'Error on server, please look.',
                error
            });
        }
    });
}
exports.handleAuth = handleAuth;
