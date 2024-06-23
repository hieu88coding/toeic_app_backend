const Sequelize = require("sequelize");
const dotenv = require('dotenv')
dotenv.config()
// deploy mode
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false //de k hien query moi khi reload trang
// });
const sequelize = new Sequelize('toeic_app', 'root', null, {
    host: '127.0.0.1',
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