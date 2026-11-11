const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../instances/mysql');

class ConsultaClima extends Model {}

ConsultaClima.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id',
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pais: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
    },
    temperatura: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    sensacaoTermica: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'sensacao_termica',
    },
    umidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    velocidadeVento: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: 'velocidade_vento',
    },
    codigoTempo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'codigo_tempo',
    },
    consultadoEm: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'consultado_em',
    },
}, {
    sequelize,
    modelName: 'ConsultaClima',
    tableName: 'consultas_clima',
    timestamps: false,
});

module.exports = ConsultaClima;
