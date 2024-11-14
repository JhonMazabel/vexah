import express from 'express';
import { body } from 'express-validator';
import { register, login, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import validateFields from '../middlewares/validateFields.js';

const router = express.Router();

// Rutas con validaciones y el middleware de validación
router.post(
    '/register',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        body('correo').isEmail().withMessage('Correo no válido'),
        body('clave').isLength({ min: 6 }).withMessage('La clave debe tener al menos 6 caracteres'),
    ],
    validateFields,
    register
);

router.post(
    '/login',
    [
        body('correo')
            .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
            .notEmpty().withMessage('El correo electrónico es obligatorio'),
        body('clave')
            .notEmpty().withMessage('La contraseña es obligatoria'),
    ],
    validateFields,
    login
);

router.post(
    '/request-password-reset',
    [
        body('correo').isEmail().withMessage('Correo no válido')
    ],
    validateFields,
    requestPasswordReset
);

router.post('/reset-password',
    [
        body('token').notEmpty().withMessage('El token es obligatorio'),
        body('nuevaClave').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    ],
    validateFields,
    resetPassword
);

export default router;