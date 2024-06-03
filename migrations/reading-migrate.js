'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Readings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            level: {
                type: Sequelize.INTEGER
            },
            partName: {
                type: Sequelize.STRING
            },
            testName: {
                type: Sequelize.STRING
            },
            pdf: {
                type: Sequelize.STRING
            },
            images: {
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
        await queryInterface.dropTable('Readings');
    }
};