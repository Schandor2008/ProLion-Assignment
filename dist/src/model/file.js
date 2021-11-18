"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
// Database entity definition of 'File'
const File = database_1.db.sequelize.define('File', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    filename: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    filetype: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    filesize: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false
    },
    modificationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    scanDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false // No timestamps should be added to the table
});
exports.File = File;
