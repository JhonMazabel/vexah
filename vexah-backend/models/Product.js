import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Product = db.define('Product', {
    id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre_producto: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imagen_portada: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'productos',
    timestamps: true,
    paranoid: true,  // Habilitar borrado lógico
});

export default Product;
