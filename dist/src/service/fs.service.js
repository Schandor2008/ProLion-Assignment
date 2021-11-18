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
exports.updateFilesFromFilesystem = exports.clearFiles = exports.readAndStoreFilesFromFilesystem = exports.getFilesize = exports.getFolders = void 0;
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_1 = require("../model/file");
const folder_transfer_object_1 = __importDefault(require("../transfer/folder.transfer.object"));
/**
 * Scans the root folder - defined in the config - on the file system and sort them by name ascending
 * @returns Promise holding an array of FolderTransferObjects (each without filesize)
 */
const getFolders = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get all folders from file system
    const folders = yield readFoldersFromFileSystem();
    // Sort asc by name
    folders.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return folders;
});
exports.getFolders = getFolders;
/**
 * Gets all files (either filtered by filetype or not)
 * Scans the root folder - defined in the config - on the file system
 * Then match the files to the found folders and store the aggregated filesizes in the folders
 * At the end sort the folders by filesize descending
 * @param ftype Filter parameter. Could be undefined or string. If undefined: no filter will be applied. Otherwhise: files will be filtered by filetype
 * @returns Promise holding an array of FolderTransferObjects (each with filesize)
 */
const getFilesize = (ftype) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all files from database (filtered by ftype or not)
    let files;
    if (ftype) {
        files = yield file_1.File.findAll({
            where: {
                filetype: ftype // filtered by GET parameter ftype
            }
        });
    }
    else {
        files = yield file_1.File.findAll();
    }
    // Get all folders from filesystem
    const folders = yield readFoldersFromFileSystem();
    // For each folder: aggregate filesize over corresponding files and assign to folder's filesize
    for (const folder of folders) {
        const aggregatedFilesize = files.filter((file) => {
            // Match file to folder via path and name members
            return file.getDataValue('path') === path_1.default.join(folder.path, folder.name);
        }).reduce((sum, current) => {
            // Sum up filesizes
            return sum + current.getDataValue('filesize');
        }, 0);
        folder.filesize = aggregatedFilesize;
    }
    // Sort folders by filesize desc
    folders.sort((a, b) => {
        return b.filesize - a.filesize;
    });
    return folders;
});
exports.getFilesize = getFilesize;
/**
 * Scans file system and stores files in the database
 * Gets file data by readFoldersFromFileSystem using a fileCallback
 */
const readAndStoreFilesFromFilesystem = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Reading and storing files from filesystem ...');
    // Use 'readFoldersFromFileSystem' to get all files and store them in the database
    const fileCallback = (path, filename, filetype, filesize, modificationDate) => __awaiter(void 0, void 0, void 0, function* () {
        const newFile = file_1.File.build({ path, filename, filetype, filesize, modificationDate, scanDate: Date.now() });
        yield newFile.save();
    });
    // fileCallback will be executed for each file found on the filesystem
    yield readFoldersFromFileSystem(fileCallback);
    console.log('Successfully read and stored files from filesystem');
});
exports.readAndStoreFilesFromFilesystem = readAndStoreFilesFromFilesystem;
/**
 * Truncates all files in the database
 */
const clearFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Truncating all files ...');
    yield file_1.File.truncate();
    console.log('Successfully truncated all files');
});
exports.clearFiles = clearFiles;
/**
 * Truncates all files in the database, rescan file system and store files in database
 */
const updateFilesFromFilesystem = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Updating files ...');
    yield (0, exports.clearFiles)();
    yield (0, exports.readAndStoreFilesFromFilesystem)();
    console.log('Successfully updated files');
});
exports.updateFilesFromFilesystem = updateFilesFromFilesystem;
// ************************* PRIVATE ****************************
/**
 * Scans root folder on the file system and returns array of FolderTransferObjects.
 * Makes use of recursive function readFoldersFromFileSystemRecursive
 * @param fileCallback Optional. Callback function that gets called for each found file
 * @returns Promise holding an array of FolderTransferObjects
 */
function readFoldersFromFileSystem(fileCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const folders = [];
        // Add root folder
        folders.push(new folder_transfer_object_1.default(path_1.default.dirname(config_1.default.rootFolder), path_1.default.basename(config_1.default.rootFolder)));
        // Calling recursive function
        yield readFoldersFromFileSystemRecursive(config_1.default.rootFolder, folders, fileCallback);
        return folders;
    });
}
/**
 * Recursive function for reading the root folder on the file system
 * @param currentFolderPath Current folder / file path. Needed for recursion
 * @param folders Array of FolderTransferObjects holding the result array
 * @param fileCallback Optional. Callback function that gets called for each found file
 */
function readFoldersFromFileSystemRecursive(currentFolderPath, folders, fileCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        const filesInCurrentFolder = fs_1.default.readdirSync(currentFolderPath);
        for (const filename of filesInCurrentFolder) {
            const filePath = path_1.default.join(currentFolderPath, filename);
            const fileStat = fs_1.default.statSync(filePath);
            if (fileStat.isDirectory()) {
                // If current file is a directory -> add to list (folders) and make a recursive call
                folders.push(new folder_transfer_object_1.default(currentFolderPath, filename));
                yield readFoldersFromFileSystemRecursive(filePath, folders, fileCallback);
            }
            else {
                // If current file is no directory AND fileCallback is defined -> call the callback with file metadata
                if (fileCallback) {
                    const filepath = currentFolderPath;
                    const filetype = path_1.default.extname(filename).replace('.', ''); // remove '.' from filetype
                    const filesize = fileStat.size;
                    const modificationDate = fileStat.mtime;
                    yield fileCallback(filepath, filename, filetype, filesize, modificationDate);
                }
            }
        }
    });
}
