import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Customer = db.define('Customer', {
    id_cliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    identificacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    codigo_postal: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    pais: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'clientes',
    timestamps: true,
    paranoid: true, // Habilitar borrado lógico
});

export default Customer;