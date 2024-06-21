'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.PartResult, {
        foreignKey: 'id',
        as: 'partResults'
      });

      User.hasMany(models.MockResult, {
        foreignKey: 'id',
        as: 'mockResults'
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      defaultValue: 'LOCAL'
    },
    email: DataTypes.STRING,
    picture: DataTypes.STRING,
    role: DataTypes.BOOLEAN,//0 la user 1 la admin

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};