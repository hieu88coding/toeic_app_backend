'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MockResult extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            MockResult.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'users'
            });
        }
    }
    MockResult.init({
        userId: DataTypes.INTEGER,
        testName: DataTypes.STRING,
        userAnswer: DataTypes.STRING,
        score: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'MockResult',
    });
    return MockResult;
};