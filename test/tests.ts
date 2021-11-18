import { assert } from 'chai';
import { describe, it } from 'mocha';
import fs from 'fs';
import * as FileSystemService from '../src/service/fs.service';
import config from '../src/config';
import path from 'path';

// Define name of root folder for tests
const datePostfix = new Date().getTime().toString();
const testRootFolder = `TestRootFolder_${datePostfix}`;

// Remove test root folder if exists already
if (fs.existsSync(testRootFolder)) {
    fs.rmSync(testRootFolder, { recursive: true });
}

// Create test root folder
fs.mkdirSync(testRootFolder);

// Set test root folder as root folder in config
config.rootFolder = testRootFolder;

describe('FileSystemService', () => {
    describe('getFolders', () => {
        it(`Must contain ${testRootFolder}`, async () => {
            const folders = await FileSystemService.getFolders();
            assert.isTrue(folders.find((folder) => { return folder.name === testRootFolder; }) != null, `Must find new folder ${testRootFolder}`);
        });

        it('Must contain newly created folders', async () => {
            const newFolderName1 = 'NewFolder1';
            const newFolderName2 = 'NewFolder2';
            const newFolderName3 = 'NewFolder3';

            // Check folders BEFORE creation
            const foldersBefore = await FileSystemService.getFolders();
            assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName1; }) == null, `Must not find new folder ${newFolderName1} before creation`);
            assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName2; }) == null, `Must not find new folder ${newFolderName2} before creation`);
            assert.isTrue(foldersBefore.find((folder) => { return folder.name === newFolderName3; }) == null, `Must not find new folder ${newFolderName3} before creation`);

            // Create folder 1
            fs.mkdirSync(path.join(testRootFolder, newFolderName1));

            // Check folders AFTER creation of folder 1
            const foldersAfter1 = await FileSystemService.getFolders();
            assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new folder ${newFolderName1} after creation`);
            assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName2; }) == null, `Must not find new folder ${newFolderName2} before creation`);
            assert.isTrue(foldersAfter1.find((folder) => { return folder.name === newFolderName3; }) == null, `Must not find new folder ${newFolderName3} before creation`);

            // Create folder 2 and 3
            fs.mkdirSync(path.join(testRootFolder, newFolderName2));
            fs.mkdirSync(path.join(testRootFolder, newFolderName3));

            // Check folders AFTER creation of folder 2 and 3
            const foldersAfter2And3 = await FileSystemService.getFolders();
            assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new folder ${newFolderName1} after creation`);
            assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName2; }) != null, `Must find new folder ${newFolderName2} after creation`);
            assert.isTrue(foldersAfter2And3.find((folder) => { return folder.name === newFolderName3; }) != null, `Must find new folder ${newFolderName3} after creation`);
        });

        it('Must contain newly created folders in order by name asc', async () => {
            const newFolderName1 = 'NewFolderCCC';
            const newFolderName2 = 'NewFolderBBB';
            const newFolderName3 = 'NewFolderAAA';
            const newFolderNames = [newFolderName1, newFolderName2, newFolderName3];

            // Create folders in reversed order
            fs.mkdirSync(path.join(testRootFolder, newFolderName1));
            fs.mkdirSync(path.join(testRootFolder, newFolderName2));
            fs.mkdirSync(path.join(testRootFolder, newFolderName3));

            // getFolders()
            const folders = await FileSystemService.getFolders();

            // Filter above folders only
            const filteredFolders = folders.filter((folder) => { return newFolderNames.includes(folder.name); });

            // Check if the filtered folders are in order (name asc)
            assert.isTrue(filteredFolders.length === 3, 'Must contain all three newly created folders');
            assert.isTrue(filteredFolders[0].name === newFolderName3, `First folder must be ${newFolderName3}`);
            assert.isTrue(filteredFolders[1].name === newFolderName2, `Second folder must be ${newFolderName2}`);
            assert.isTrue(filteredFolders[2].name === newFolderName1, `Third folder must be ${newFolderName1}`);
        });

        it('Must contain newly created sub-folders', async () => {
            const newFolderName1 = 'NewFolderSub1';
            const newFolderName2 = 'NewFolderSub2';
            const newFolderName3 = 'NewFolderSub3';

            // Create sub-folder hierarchy
            fs.mkdirSync(path.join(testRootFolder, newFolderName1));
            fs.mkdirSync(path.join(testRootFolder, newFolderName1, newFolderName2));
            fs.mkdirSync(path.join(testRootFolder, newFolderName1, newFolderName2, newFolderName3));

            // getFolders()
            const folders = await FileSystemService.getFolders();

            // Check if sub-folder hierarchy is contained
            assert.isTrue(folders.find((folder) => { return folder.name === newFolderName1; }) != null, `Must find new sub-folder ${newFolderName1}`);
            assert.isTrue(folders.find((folder) => { return folder.name === newFolderName2; }) != null, `Must find new sub-folder ${newFolderName2}`);
            assert.isTrue(folders.find((folder) => { return folder.name === newFolderName3; }) != null, `Must find new sub-folder ${newFolderName3}`);
        });

        it('Must not contain deleted folders and sub-folders', async () => {
            const folderNameDelete1 = 'FolderDelete1';
            const folderNameDelete2 = 'FolderDelete2';
            const folderNameDelete3 = 'FolderDelete3';

            // Create folders (3 is sub-folder of 2)
            fs.mkdirSync(path.join(testRootFolder, folderNameDelete1));
            fs.mkdirSync(path.join(testRootFolder, folderNameDelete2));
            fs.mkdirSync(path.join(testRootFolder, folderNameDelete2, folderNameDelete3));

            // Check if all folders are contained
            const foldersAllCreated = await FileSystemService.getFolders();
            assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete1; }) != null, `Must find folder ${folderNameDelete1} after creation`);
            assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete2; }) != null, `Must find folder ${folderNameDelete2} after creation`);
            assert.isTrue(foldersAllCreated.find((folder) => { return folder.name === folderNameDelete3; }) != null, `Must find folder ${folderNameDelete3} after creation`);

            // Delete folder 1
            fs.rmSync(path.join(testRootFolder, folderNameDelete1), { recursive: true });

            // Check that folder 1 is not contained anymore but folder 2 and 3 are still contained
            const foldersDeleted1 = await FileSystemService.getFolders();
            assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete1; }) == null, `Must not find folder ${folderNameDelete1} after deletion`);
            assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete2; }) != null, `Must find folder ${folderNameDelete2} before deletion`);
            assert.isTrue(foldersDeleted1.find((folder) => { return folder.name === folderNameDelete3; }) != null, `Must find folder ${folderNameDelete3} before deletion`);

            // Delete folder 2 (this should also delete folder 3 because it is a sub-folder of folder 2)
            fs.rmSync(path.join(testRootFolder, folderNameDelete2), { recursive: true });

            // Check that no folder is contained anymore
            const foldersDeleted2 = await FileSystemService.getFolders();
            assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete1; }) == null, `Must not find folder ${folderNameDelete1} after deletion`);
            assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete2; }) == null, `Must not find folder ${folderNameDelete2} after deletion`);
            assert.isTrue(foldersDeleted2.find((folder) => { return folder.name === folderNameDelete3; }) == null, `Must not find folder ${folderNameDelete3} after deletion`);
        });
    });
}).afterAll(() => {
    // Remove test root folder after tests
    fs.rmSync(testRootFolder, { recursive: true });
});
