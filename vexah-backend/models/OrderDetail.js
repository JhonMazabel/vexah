import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Order from './Order.js';
import Product from './Product.js';

const OrderDetail = db.define('OrderDetail', {
    id_detalle: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_orden: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id_orden',
        },
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
    precio_unitario: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'detalle_ordenes',
    timestamps: true,
});

export default OrderDetail;