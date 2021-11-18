"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT || 8081,
    rootFolder: process.env.ROOT_FOLDER || 'RootFolder',
    updateIntervall: process.env.UPDATE_INTERVALL || 1 // intervall in which the folder gets reprocessed (in minutes)
};
