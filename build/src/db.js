"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const dbUri = `mongodb+srv://${config_1.dbUser}:${config_1.dbPass}@cluster0.fo3dmlm.mongodb.net`;
function connect() {
    mongoose_1.default.connect(dbUri, {
        appName: 'Cluster0',
        writeConcern: { w: 'majority' },
        retryWrites: true,
        dbName: 'tellme'
    })
        .then(({ connection }) => console.log({ status: 'connected', db: connection.db.databaseName }))
        .catch((error) => console.error({ status: 'error', error }));
}
exports.default = connect;
