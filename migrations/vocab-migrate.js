'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vocabularies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      topicName: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.INTEGER
      },
      word: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      transcribe: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      meaning: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vocabularies');
  }
};