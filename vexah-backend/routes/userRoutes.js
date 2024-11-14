import express from 'express';
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.js';
import { authorizeRole, authenticateToken } from "../middlewares/authMiddleware.js";

import { listarTodosUsuarios, actualizarUsuario, eliminarUsuario } from '../controllers/userController.js';

const router = express.Router();

// Rutas para la gestión de usuarios (solo accesibles por el rol administrador)
router.get('/', authenticateToken, authorizeRole('ADMINISTRADOR'), listarTodosUsuarios);
router.put('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), actualizarUsuario);
router.delete('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), eliminarUsuario);

export default router;