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
            // define association here
        }
    }
    MockResult.init({
        userId: DataTypes.INTEGER,
        testName: DataTypes.STRING,
        score: DataTypes.INTEGER,
        correctCount: DataTypes.INTEGER,
        wrongCount: DataTypes.INTEGER,
        pdf: DataTypes.STRING,
        userAnswer: DataTypes.STRING,
        correctAnswer: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'MockResult',
    });
    return MockResult;
};