'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vocabulary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vocabulary.init({
    topicName: DataTypes.STRING,
    number: DataTypes.INTEGER,
    word: DataTypes.STRING,
    type: DataTypes.STRING,
    transcribe: DataTypes.STRING,
    image: DataTypes.STRING,
    meaning: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Vocabulary',
  });
  return Vocabulary;
};