import { Sequelize } from 'sequelize';

// Instantiating sequelize ORM
const sequelize = new Sequelize('sqlite::memory:');

// db object contains sequelize instance and method of initialization
export const db = {
    sequelize: sequelize,

    // Validate database connection
    async init (): Promise<void> {
        await sequelize.authenticate();
    }
};
