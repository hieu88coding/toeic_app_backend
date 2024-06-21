const Sequelize = require("sequelize");
const dotenv = require('dotenv')
dotenv.config()
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NAME, 'root', null, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false //de k hien query moi khi reload trang
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;