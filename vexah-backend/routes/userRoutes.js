import express from 'express';
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.js';
import { authorizeRole, authenticateToken } from "../middlewares/authMiddleware.js";

import { listarTodosUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario, crearUsuario, cambiarEstadoUsuario } from '../controllers/userController.js';

const router = express.Router();

// Rutas para la gestión de usuarios (solo accesibles por el rol administrador)
router.post(
    '/',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    [
        body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres'),
        body('correo')
            .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
            .notEmpty().withMessage('El correo electrónico es obligatorio')
            .isLength({ max: 100 }).withMessage('El correo no debe exceder 100 caracteres'),
        body('rol')
            .optional()
            .isIn(['ADMINISTRADOR', 'USUARIO']).withMessage('Rol no válido, debe ser ADMINISTRADOR o USUARIO'),
        body('clave')
            .notEmpty().withMessage('La clave es obligatoria')
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    validateFields,
    crearUsuario
);

router.get(
    '/',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    listarTodosUsuarios
);

router.get(
    '/:id',
    authenticateToken, 
    authorizeRole('ADMINISTRADOR'), 
    obtenerUsuarioPorId
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    [
        body('nombre')
        .optional()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres'),
        body('correo')
            .optional()
            .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
            .isLength({ max: 100 }).withMessage('El correo no debe exceder 100 caracteres'),
        body('rol')
            .optional()
            .isIn(['ADMINISTRADOR', 'USUARIO']).withMessage('Rol no válido, debe ser ADMINISTRADOR o USUARIO'),
        body('clave')
            .optional()
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    validateFields,
    actualizarUsuario
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'), 
    eliminarUsuario
);

// Ruta para cambiar estado del usuario (borrar o recuperar automáticamente)
router.patch(
    '/:id/cambiar-estado',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    cambiarEstadoUsuario
);

export default router;