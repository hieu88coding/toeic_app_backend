'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Writting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Writting.init({
        partName: DataTypes.STRING,
        testName: DataTypes.STRING,
        pdf: DataTypes.STRING,
        images: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Writting',
    });
    return Writting;
};