import express from 'express';
import { body, param } from 'express-validator';
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from '../controllers/roleController.js';
import validateFields from '../middlewares/validateFields.js';

const router = express.Router();

// Validaciones comunes para el rol
const roleValidationRules = [
    body('nombre_rol')
        .notEmpty().withMessage('El nombre del rol es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre del rol no debe exceder 50 caracteres'),
    body('descripcion')
        .optional()
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder 255 caracteres'),
];

// Rutas con validaciones y el middleware de validación
router.post('/', roleValidationRules, validateFields, createRole); // Crear un nuevo rol
router.get('/', getRoles); // Obtener todos los roles
router.get('/:id', param('id').isInt().withMessage('ID inválido'), validateFields, getRoleById); // Obtener un rol por ID
router.put('/:id', [param('id').isInt().withMessage('ID inválido'), ...roleValidationRules], validateFields, updateRole); // Actualizar un rol por ID
router.delete('/:id', param('id').isInt().withMessage('ID inválido'), validateFields, deleteRole); // Eliminar un rol por ID

export default router;