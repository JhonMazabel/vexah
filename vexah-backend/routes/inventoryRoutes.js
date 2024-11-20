import express from 'express';
import { body } from 'express-validator';
import {
    crearTransaccionInventario,
    listarTransaccionesInventario,
    obtenerTransaccionPorId,
    listarTransaccionesPorProducto
} from '../controllers/inventoryController.js';
import validateFields from '../middlewares/validateFields.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para crear una nueva transacción de inventario
router.post(
    '/',
    authenticateToken,
    authorizeRole('ADMINISTRADOR'),
    [
        body('id_producto').notEmpty().withMessage('El ID del producto es obligatorio'),
        body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo'),
        body('tipo').isIn(['ENTRADA', 'SALIDA', 'VENTA']).withMessage('El tipo de transacción no es válido'),
        validateFields
    ],
    crearTransaccionInventario
);

// Ruta para listar todas las transacciones de inventario
router.get('/', authenticateToken, listarTransaccionesInventario);

// Ruta para listar todas las transacciones de un producto específico por su ID
router.get('/producto/:id_producto', authenticateToken, listarTransaccionesPorProducto);

// Ruta para obtener una transacción de inventario por ID
router.get('/:id', authenticateToken, obtenerTransaccionPorId);

export default router;