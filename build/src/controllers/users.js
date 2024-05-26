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
exports.getUserById = void 0;
const user_1 = __importDefault(require("../db-models/user"));
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.id;
        const correctQuery = userId && userId !== '';
        if (!correctQuery)
            return res.status(400).json('This query params is wrong.');
        try {
            const user = yield user_1.default.findById(userId);
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    });
}
exports.getUserById = getUserById;
