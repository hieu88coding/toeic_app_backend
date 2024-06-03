'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserLevel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserLevel.init({
        userId: DataTypes.INTEGER,
        levelName: DataTypes.STRING,
        levelStart: DataTypes.INTEGER,
        levelEnd: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'UserLevel',
    });
    return UserLevel;
};