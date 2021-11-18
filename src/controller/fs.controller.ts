import { Request, Response } from 'express';
import * as FileSystemService from '../service/fs.service';

/**
 * Controller for saying hello
 * @param req Rest Request
 * @param res Rest Response
 */
export const helloProLion = async (req: Request, res: Response): Promise<void> => {
    res.send('Hello ProLion');
};

/**
 * Controller for getting the current folder list from the file system
 * @param req Rest Request
 * @param res Rest Response
 */
export const getFolders = async (req: Request, res: Response): Promise<void> => {
    const folders = await FileSystemService.getFolders();
    res.json(folders);
};

/**
 * Controller for getting the current folder list with the aggregated file size
 * Result can be filtered by GET parameter 'ftype' (= filetype)
 * @param req Rest Request
 * @param res Rest Response
 */
export const getFilesize = async (req: Request, res: Response): Promise<void> => {
    const filesize = await FileSystemService.getFilesize(req.query.ftype?.toString());
    res.json(filesize);
};
