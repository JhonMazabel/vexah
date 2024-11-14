import express from 'express';
import { body } from 'express-validator';
import { create, login } from '../controllers/authController.js';
import validateFields from '../middlewares/validateFields.js';

const router = express.Router();

// Validaciones para el registro
const registerValidationRules = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no debe exceder 100 caracteres'),
    body('correo')
        .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
        .notEmpty().withMessage('El correo electrónico es obligatorio'),
    body('contraseña')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    body('rol_id')
        .isInt().withMessage('El rol debe ser un ID numérico')
        .notEmpty().withMessage('El rol es obligatorio'),
];

// Validaciones para el inicio de sesión
const loginValidationRules = [
    body('correo')
        .isEmail().withMessage('Debe proporcionar un correo electrónico válido')
        .notEmpty().withMessage('El correo electrónico es obligatorio'),
    body('contraseña')
        .notEmpty().withMessage('La contraseña es obligatoria'),
];

// Rutas con validaciones y el middleware de validación
router.post('/create', registerValidationRules, validateFields, create); // Registro
router.post('/login', loginValidationRules, validateFields, login); // Inicio de sesión

export default router;