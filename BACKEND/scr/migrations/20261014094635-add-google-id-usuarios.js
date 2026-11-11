'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    //quem entra pelo google n tem senha no nosso banco
    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'googleId');
  },
};
