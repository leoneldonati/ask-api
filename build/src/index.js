"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
app_1.app.listen(config_1.port, () => {
    (0, db_1.default)();
    console.log('hey!');
});
