import { Express } from 'express';
import * as FileSystemController from '../controller/fs.controller';

/**
 * Connects the rest paths to controllers
 * @param app Express app
 */
export default (app: Express): void => {
    app.get('/', FileSystemController.helloProLion);

    app.get('/folders', FileSystemController.getFolders);

    app.get('/filesize', FileSystemController.getFilesize);
};
