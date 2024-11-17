import express from 'express';

import {
    crearOrden,
    listarOrdenes,
    obtenerOrdenPorId,
    actualizarOrden,
    eliminarOrden,
    restaurarOrden,
    imprimirOrden
} from '../controllers/orderController.js';

import validateFields from '../middlewares/validateFields.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Ruta para crear una nueva orden
router.post(
    '/',
    authenticateToken,
    [
        body('id_cliente').notEmpty().withMessage('El ID del cliente es obligatorio'),
        body('productos').isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la orden'),
        validateFields
    ],
    crearOrden
);

// Ruta para listar todas las órdenes
router.get('/', authenticateToken, listarOrdenes);

// Ruta para obtener una orden por ID
router.get('/:id', authenticateToken, obtenerOrdenPorId);

// Ruta para actualizar una orden
router.put(
    '/:id',
    authenticateToken,
    [
        body('productos').isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la orden'),
        validateFields
    ],
    actualizarOrden
);

// Ruta para eliminar una orden (borrado lógico)
router.delete('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), eliminarOrden);

// Ruta para restaurar una orden eliminada lógicamente
router.patch('/:id', authenticateToken, authorizeRole('ADMINISTRADOR'), restaurarOrden);

// Ruta para imprimir una orden (generar PDF)
router.get('/:id/imprimir', authenticateToken, imprimirOrden);

export default router;