import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Product from './Product.js';
import User from './User.js';

const InventoryTransaction = db.define('InventoryTransaction', {
    id_transaccion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_producto: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id_producto',
        },
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.ENUM('ENTRADA', 'SALIDA', 'VENTA'),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id_usuario',
        },
    },
}, {
    tableName: 'transacciones_inventario',
    timestamps: true,
});

export default InventoryTransaction;
