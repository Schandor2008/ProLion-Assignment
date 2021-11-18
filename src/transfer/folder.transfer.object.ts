// Data transfer object for a Folder
export default class FolderTransferObject {
    public path!: string;
    public name!: string;
    public filesize?: number;

    constructor (path: string, name: string, filesize?: number) {
        this.path = path;
        this.name = name;
        this.filesize = filesize;
    }
}
