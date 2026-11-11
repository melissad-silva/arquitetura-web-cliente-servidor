'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('consultas_clima', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            usuario_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'usuarios', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            cidade: { type: Sequelize.STRING, allowNull: false },
            pais: { type: Sequelize.STRING, allowNull: true },
            latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: false },
            longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: false },
            temperatura: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
            sensacao_termica: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
            umidade: { type: Sequelize.INTEGER, allowNull: false },
            velocidade_vento: { type: Sequelize.DECIMAL(5, 2), allowNull: false },
            codigo_tempo: { type: Sequelize.INTEGER, allowNull: false },
            consultado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('consultas_clima');
    },
};
