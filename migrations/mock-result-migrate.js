'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MockResults', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            testName: {
                type: Sequelize.STRING
            },
            score: {
                type: Sequelize.INTEGER
            },
            correctCount: {
                type: Sequelize.INTEGER
            },
            wrongCount: {
                type: Sequelize.INTEGER
            },
            pdf: {
                type: Sequelize.STRING
            },
            userAnswer: {
                type: Sequelize.STRING
            },
            correctAnswer: {
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
        await queryInterface.dropTable('MockResults');
    }
};