import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const User = db.define('User', {
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  clave: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('ADMINISTRADOR', 'USUARIO'),
    defaultValue: "USUARIO"
  },
  token_recuperacion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiracion_token: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: { exclude: ['clave'] }, // Excluir la contraseña por defecto
  },
  scopes: {
    withPassword: {attributes: {}}, // Para incluir la contraseña si es necesario
  },
});

export default User;