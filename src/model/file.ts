import { DataTypes } from 'sequelize';
import { db } from '../database';

// Database entity definition of 'File'
const File = db.sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filename: {

        type: DataTypes.STRING,
        allowNull: false
    },
    filetype: {

        type: DataTypes.STRING,
        allowNull: false
    },
    filesize: {

        type: DataTypes.NUMBER,
        allowNull: false
    },
    modificationDate: {

        type: DataTypes.DATE,
        allowNull: false
    },
    scanDate: {

        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true, // Name of table should be the same as above
    timestamps: false // No timestamps should be added to the table
});

export { File };
