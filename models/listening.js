'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listening extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Listening.init({
    level: DataTypes.INTEGER,
    partName: DataTypes.STRING,
    testName: DataTypes.STRING,
    pdf: DataTypes.STRING,
    images: DataTypes.STRING,
    audiomp3: DataTypes.STRING,
    correctAnswer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Listening',
  });
  return Listening;
};