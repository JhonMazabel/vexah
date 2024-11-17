import express from 'express';
import { body } from 'express-validator';
import validateFields from '../middlewares/validateFields.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadConfig.js';

import {
    crearProducto,
    listarTodosProductos,
    listarProductosActivos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    cambiarEstadoProducto,
    buscarProductos
} from '../controllers/productController.js';

const router = express.Router();

// Rutas para la gestión de productos
router.post(
    '/',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    upload.single('imagen_portada'),
    [
        body('nombre_producto')
        .notEmpty().withMessage('El nombre del producto es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre del producto no debe exceder los 100 caracteres'),
        body('precio')
            .notEmpty().withMessage('El precio es obligatorio')
            .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
        body('stock')
            .notEmpty().withMessage('El stock es obligatorio')
            .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
        body('descripcion')
            .optional()
            .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres')
    ],
    validateFields,
    crearProducto
);

router.get('/', authenticateToken, listarProductosActivos);
router.get('/all', authenticateToken, authorizeRole('ADMINISTRADOR'), listarTodosProductos);
router.get('/search', authenticateToken, buscarProductos);
router.get('/:id', authenticateToken, obtenerProductoPorId);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    upload.single('imagen_portada'),
    [
        body('nombre_producto')
        .optional()
        .isLength({ max: 100 }).withMessage('El nombre del producto no debe exceder los 100 caracteres'),
    body('precio')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
    body('descripcion')
        .optional()
        .isLength({ max: 255 }).withMessage('La descripción no debe exceder los 255 caracteres')
    ],
    validateFields,
    actualizarProducto
);

router.delete('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), eliminarProducto);

// Cambiar estado del producto (restaurar o eliminar lógicamente)
router.patch('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), cambiarEstadoProducto);

export default router;