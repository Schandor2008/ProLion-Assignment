"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const fs_routes_1 = __importDefault(require("./route/fs.routes"));
const database_1 = require("./database");
const file_1 = require("./model/file");
const FileSystemService = __importStar(require("./service/fs.service"));
const node_cron_1 = __importDefault(require("node-cron"));
// Init express
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Init routes
(0, fs_routes_1.default)(app);
// Init database (in memory sqlite3)
database_1.db.init().then(() => {
    console.log('Database connection has been established successfully.');
    // Syncing models to database
    const sync = file_1.File.sync();
    return sync;
}).then(() => {
    console.log('Database models have been synced successfully.');
    // Starting cron job
    const updateIntervall = config_1.default.updateIntervall;
    console.log(`Starting cron job that runs every ${updateIntervall}. minute...`);
    node_cron_1.default.schedule(`*/${updateIntervall} * * * *`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield FileSystemService.updateFilesFromFilesystem();
    }));
    // Start app
    app.listen(config_1.default.port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`App listening at http://localhost:${config_1.default.port} ...`);
        // Fill database files on start up
        yield FileSystemService.readAndStoreFilesFromFilesystem();
    }));
}).catch((error) => {
    console.error('An error occurred: ', error);
    process.exit(-1);
});
