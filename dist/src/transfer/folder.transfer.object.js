"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Data transfer object for a Folder
class FolderTransferObject {
    constructor(path, name, filesize) {
        this.path = path;
        this.name = name;
        this.filesize = filesize;
    }
}
exports.default = FolderTransferObject;
