'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PartResult extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PartResult.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'users'
            });
        }
    }
    PartResult.init({
        userId: DataTypes.INTEGER,
        testName: DataTypes.STRING,
        partName: DataTypes.STRING,
        userAnswer: DataTypes.STRING,
        score: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'PartResult',
    });
    return PartResult;
};