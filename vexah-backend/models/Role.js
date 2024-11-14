import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Role = db.define('Role', {
    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_rol: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'vexah_roles',
    timestamps: false,
});

export default Role;
