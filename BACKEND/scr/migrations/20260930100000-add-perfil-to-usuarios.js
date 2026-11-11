'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('usuarios', 'perfil', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'admin',
        });
    },

    async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'perfil');
    },
};