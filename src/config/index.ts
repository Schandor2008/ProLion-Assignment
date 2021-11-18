import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 8081, // port for express
    rootFolder: process.env.ROOT_FOLDER || 'RootFolder', // the folder
    updateIntervall: process.env.UPDATE_INTERVALL || 1 // intervall in which the folder gets reprocessed (in minutes)
};
