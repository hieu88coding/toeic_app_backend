'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Grammar extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Grammar.init({
        testName: DataTypes.STRING,
        pdf: DataTypes.STRING,
        correctAnswer: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Grammar',
    });
    return Grammar;
};