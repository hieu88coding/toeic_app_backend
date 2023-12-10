'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VocabularyExercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VocabularyExercise.init({
    topicId: DataTypes.INTEGER,
    number: DataTypes.INTEGER,
    content: DataTypes.STRING,
    transcribe: DataTypes.STRING,
    image: DataTypes.STRING,
    audiomp3: DataTypes.STRING,
    meaning: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VocabularyExercise',
  });
  return VocabularyExercise;
};