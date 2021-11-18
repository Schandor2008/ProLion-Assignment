import express from 'express';
import config from './config';
import routes from './route/fs.routes';
import { db } from './database';
import { File } from './model/file';
import * as FileSystemService from './service/fs.service';
import cron from 'node-cron';

// Init express
const app = express();
app.use(express.json());

// Init routes
routes(app);

// Init database (in memory sqlite3)
db.init().then(() => {
    console.log('Database connection has been established successfully.');

    // Syncing models to database
    const sync = File.sync();
    return sync;
}).then(() => {
    console.log('Database models have been synced successfully.');

    // Starting cron job
    const updateIntervall = config.updateIntervall;
    console.log(`Starting cron job that runs every ${updateIntervall}. minute...`);
    cron.schedule(`*/${updateIntervall} * * * *`, async (): Promise<void> => {
        await FileSystemService.updateFilesFromFilesystem();
    });

    // Start app
    app.listen(config.port, async (): Promise<void> => {
        console.log(`App listening at http://localhost:${config.port} ...`);

        // Fill database files on start up
        await FileSystemService.readAndStoreFilesFromFilesystem();
    });
}).catch((error) => {
    console.error('An error occurred: ', error);
    process.exit(-1);
});
