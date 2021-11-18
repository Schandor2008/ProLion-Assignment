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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const fs_1 = __importDefault(require("fs"));
const FileSystemService = __importStar(require("../src/service/fs.service"));
const config_1 = __importDefault(require("../src/config"));
const path_1 = __importDefault(require("path"));
// Define name of root folder for tests
const datePostfix = new Date().getTime().toString();
const testRootFolder = `TestRootFolder_${datePostfix}`;
// Remove test root folder if exists already
if (fs_1.default.existsSync(testRootFolder)) {
    fs_1.default.rmSync(testRootFolder, { recursive: true });
}
// Create test root folder
fs_1.default.mkdirSync(testRootFolder);
// Set test root folder as root folder in config
config_1.default.rootFolder = testRootFolder;
(0, mocha_1.describe)('FileSystemService', () => {
    (0, mocha_1.describe)('getFolders', () => {
        (0, mocha_1.it)(`Must contain ${testRootFolder}`, () => __awaiter(void 0, void 0, void 0, function* () {
            const folders = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(folders.find((folder) => { return folder.name === testRootFolder; }) != null, `Must find new folder ${testRootFolder}`);
        }));
        (0, mocha_1.it)('Must contain newly created folders', () => __awaiter(void 0, void 0, void 0, function* () {
            const newFolderName1 = 'NewFolder1';
            const newFolderName2 = 'NewFolder2';
            const newFolderName3 = 'NewFolder3';
            // Check folders BEFORE creation
            const foldersBefore = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName1; }) == null, `Must not find new folder ${newFolderName1} before creation`);
            chai_1.assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName2; }) == null, `Must not find new folder ${newFolderName2} before creation`);
            chai_1.assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName3; }) == null, `Must not find new folder ${newFolderName3} before creation`);
            // Create folder 1
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName1));
            // Check folders AFTER creation of folder 1
            const foldersAfter1 = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new folder ${newFolderName1} after creation`);
            chai_1.assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName2; }) == null, `Must not find new folder ${newFolderName2} before creation`);
            chai_1.assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName3; }) == null, `Must not find new folder ${newFolderName3} before creation`);
            // Create folder 2 and 3
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName2));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName3));
            // Check folders AFTER creation of folder 2 and 3
            const foldersAfter2And3 = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new folder ${newFolderName1} after creation`);
            chai_1.assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName2; }) != null, `Must find new folder ${newFolderName2} after creation`);
            chai_1.assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName3; }) != null, `Must find new folder ${newFolderName3} after creation`);
        }));
        (0, mocha_1.it)('Must contain newly created folders in order by name asc', () => __awaiter(void 0, void 0, void 0, function* () {
            const newFolderName1 = 'NewFolderCCC';
            const newFolderName2 = 'NewFolderBBB';
            const newFolderName3 = 'NewFolderAAA';
            const newFolderNames = [newFolderName1, newFolderName2, newFolderName3];
            // Create folders in reversed order
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName1));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName2));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName3));
            // getFolders()
            const folders = yield FileSystemService.getFolders();
            // Filter above folders only
            const filteredFolders = folders.filter((folder) => { return newFolderNames.includes(folder.name); });
            // Check if the filtered folders are in order (name asc)
            chai_1.assert.isTrue(filteredFolders.length === 3, 'Must contain all three newly created folders');
            chai_1.assert.isTrue(filteredFolders[0].name === newFolderName3, `First folder must be ${newFolderName3}`);
            chai_1.assert.isTrue(filteredFolders[1].name === newFolderName2, `Second folder must be ${newFolderName2}`);
            chai_1.assert.isTrue(filteredFolders[2].name === newFolderName1, `Third folder must be ${newFolderName1}`);
        }));
        (0, mocha_1.it)('Must contain newly created sub-folders', () => __awaiter(void 0, void 0, void 0, function* () {
            const newFolderName1 = 'NewFolderSub1';
            const newFolderName2 = 'NewFolderSub2';
            const newFolderName3 = 'NewFolderSub3';
            // Create sub-folder hierarchy
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName1));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName1, newFolderName2));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, newFolderName1, newFolderName2, newFolderName3));
            // getFolders()
            const folders = yield FileSystemService.getFolders();
            // Check if sub-folder hierarchy is contained
            chai_1.assert.isTrue(folders.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new sub-folder ${newFolderName1}`);
            chai_1.assert.isTrue(folders.find((folder) => { return folder.name === newFolderName2; }) != null, `Must find new sub-folder ${newFolderName2}`);
            chai_1.assert.isTrue(folders.find((folder) => { return folder.name === newFolderName3; }) != null, `Must find new sub-folder ${newFolderName3}`);
        }));
        (0, mocha_1.it)('Must not contain deleted folders and sub-folders', () => __awaiter(void 0, void 0, void 0, function* () {
            const folderNameDelete1 = 'FolderDelete1';
            const folderNameDelete2 = 'FolderDelete2';
            const folderNameDelete3 = 'FolderDelete3';
            // Create folders (3 is sub-folder of 2)
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, folderNameDelete1));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, folderNameDelete2));
            fs_1.default.mkdirSync(path_1.default.join(testRootFolder, folderNameDelete2, folderNameDelete3));
            // Check if all folders are contained
            const foldersAllCreated = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete1; }) != null, `Must find folder ${folderNameDelete1} after creation`);
            chai_1.assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete2; }) != null, `Must find folder ${folderNameDelete2} after creation`);
            chai_1.assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete3; }) != null, `Must find folder ${folderNameDelete3} after creation`);
            // Delete folder 1
            fs_1.default.rmSync(path_1.default.join(testRootFolder, folderNameDelete1), { recursive: true });
            // Check that folder 1 is not contained anymore but folder 2 and 3 are still contained
            const foldersDeleted1 = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete1; }) == null, `Must not find folder ${folderNameDelete1} after deletion`);
            chai_1.assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete2; }) != null, `Must find folder ${folderNameDelete2} before deletion`);
            chai_1.assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete3; }) != null, `Must find folder ${folderNameDelete3} before deletion`);
            // Delete folder 2 (this should also delete folder 3 because it is a sub-folder of folder 2)
            fs_1.default.rmSync(path_1.default.join(testRootFolder, folderNameDelete2), { recursive: true });
            // Check that no folder is contained anymore
            const foldersDeleted2 = yield FileSystemService.getFolders();
            chai_1.assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete1; }) == null, `Must not find folder ${folderNameDelete1} after deletion`);
            chai_1.assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete2; }) == null, `Must not find folder ${folderNameDelete2} after deletion`);
            chai_1.assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete3; }) == null, `Must not find folder ${folderNameDelete3} after deletion`);
        }));
    });
}).afterAll(() => {
    // Remove test root folder after tests
    fs_1.default.rmSync(testRootFolder, { recursive: true });
});
