import config from '../config';
import fs from 'fs';
import path from 'path';
import { File } from '../model/file';
import { Model } from 'sequelize';
import FolderTransferObject from '../transfer/folder.transfer.object';

// Function type alias for FileCallback
type FileCallback = (path: string, filename: string, filetype: string, filesize: number, modificationDate: Date) => Promise<void>;

/**
 * Scans the root folder - defined in the config - on the file system and sort them by name ascending
 * @returns Promise holding an array of FolderTransferObjects (each without filesize)
 */
export const getFolders = async (): Promise<FolderTransferObject[]> => {
    // Get all folders from file system
    const folders: FolderTransferObject[] = await readFoldersFromFileSystem();

    // Sort asc by name
    folders.sort((a: FolderTransferObject, b: FolderTransferObject): number => {
        return a.name.localeCompare(b.name);
    });

    return folders;
};

/**
 * Gets all files (either filtered by filetype or not)
 * Scans the root folder - defined in the config - on the file system
 * Then match the files to the found folders and store the aggregated filesizes in the folders
 * At the end sort the folders by filesize descending
 * @param ftype Filter parameter. Could be undefined or string. If undefined: no filter will be applied. Otherwhise: files will be filtered by filetype
 * @returns Promise holding an array of FolderTransferObjects (each with filesize)
 */
export const getFilesize = async (ftype?: string): Promise<FolderTransferObject[]> => {
    // Get all files from database (filtered by ftype or not)
    let files: Model<any, any>[];
    if (ftype) {
        files = await File.findAll({
            where: {
                filetype: ftype // filtered by GET parameter ftype
            }
        });
    } else {
        files = await File.findAll();
    }

    // Get all folders from filesystem
    const folders: FolderTransferObject[] = await readFoldersFromFileSystem();

    // For each folder: aggregate filesize over corresponding files and assign to folder's filesize
    for (const folder of folders) {
        const aggregatedFilesize = files.filter((file: Model<any, any>) => {
            // Match file to folder via path and name members
            return file.getDataValue('path') === path.join(folder.path, folder.name);
        }).reduce((sum, current) => {
            // Sum up filesizes
            return sum + current.getDataValue('filesize');
        }, 0);
        folder.filesize = aggregatedFilesize;
    }

    // Sort folders by filesize desc
    folders.sort((a: FolderTransferObject, b: FolderTransferObject): number => {
        return b.filesize! - a.filesize!;
    });

    return folders;
};

/**
 * Scans file system and stores files in the database
 * Gets file data by readFoldersFromFileSystem using a fileCallback
 */
export const readAndStoreFilesFromFilesystem = async (): Promise<void> => {
    console.log('Reading and storing files from filesystem ...');

    // Use 'readFoldersFromFileSystem' to get all files and store them in the database
    const fileCallback = async (path: string, filename: string, filetype: string, filesize: number, modificationDate: Date) => {
        const newFile = File.build({ path, filename, filetype, filesize, modificationDate, scanDate: Date.now() });
        await newFile.save();
    };
    // fileCallback will be executed for each file found on the filesystem
    await readFoldersFromFileSystem(fileCallback);

    console.log('Successfully read and stored files from filesystem');
};

/**
 * Truncates all files in the database
 */
export const clearFiles = async (): Promise<void> => {
    console.log('Truncating all files ...');
    await File.truncate();
    console.log('Successfully truncated all files');
};

/**
 * Truncates all files in the database, rescan file system and store files in database
 */
export const updateFilesFromFilesystem = async (): Promise<void> => {
    console.log('Updating files ...');
    await clearFiles();
    await readAndStoreFilesFromFilesystem();
    console.log('Successfully updated files');
};

// ************************* PRIVATE ****************************
/**
 * Scans root folder on the file system and returns array of FolderTransferObjects.
 * Makes use of recursive function readFoldersFromFileSystemRecursive
 * @param fileCallback Optional. Callback function that gets called for each found file
 * @returns Promise holding an array of FolderTransferObjects
 */
async function readFoldersFromFileSystem (fileCallback?: FileCallback): Promise<FolderTransferObject[]> {
    const folders: FolderTransferObject[] = [];

    // Add root folder
    folders.push(new FolderTransferObject(path.dirname(config.rootFolder), path.basename(config.rootFolder)));

    // Calling recursive function
    await readFoldersFromFileSystemRecursive(config.rootFolder, folders, fileCallback);
    return folders;
}

/**
 * Recursive function for reading the root folder on the file system
 * @param currentFolderPath Current folder / file path. Needed for recursion
 * @param folders Array of FolderTransferObjects holding the result array
 * @param fileCallback Optional. Callback function that gets called for each found file
 */
async function readFoldersFromFileSystemRecursive (currentFolderPath: string, folders: FolderTransferObject[], fileCallback?: FileCallback): Promise<void> {
    const filesInCurrentFolder = fs.readdirSync(currentFolderPath);
    for (const filename of filesInCurrentFolder) {
        const filePath = path.join(currentFolderPath, filename);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            // If current file is a directory -> add to list (folders) and make a recursive call
            folders.push(new FolderTransferObject(currentFolderPath, filename));
            await readFoldersFromFileSystemRecursive(filePath, folders, fileCallback);
        } else {
            // If current file is no directory AND fileCallback is defined -> call the callback with file metadata
            if (fileCallback) {
                const filepath = currentFolderPath;
                const filetype = path.extname(filename).replace('.', ''); // remove '.' from filetype
                const filesize = fileStat.size;
                const modificationDate = fileStat.mtime;
                await fileCallback(filepath, filename, filetype, filesize, modificationDate);
            }
        }
    }
}
