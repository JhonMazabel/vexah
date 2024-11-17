import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Customer from './Customer.js';
import User from './User.js';

const Order = db.define('Order', {
    id_orden: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id_cliente',
        },
    },
    id_asesor: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_usuario',
        },
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'ordenes',
    timestamps: true,
});

export default Order;
