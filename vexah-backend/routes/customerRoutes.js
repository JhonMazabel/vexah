import express from 'express';
import { body } from 'express-validator';
import {
    crearCliente,
    listarClientes,
    obtenerClientePorId,
    obtenerClientePorIdentificacion,
    actualizarCliente,
    eliminarCliente,
    cambiarEstadoCliente
} from '../controllers/customerController.js';
import validateFields from '../middlewares/validateFields.js';

const router = express.Router();

// Ruta para crear un nuevo cliente
router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre del cliente es obligatorio'),
        body('identificacion').notEmpty().withMessage('La identificación del cliente es obligatoria'),
        body('correo').optional().isEmail().withMessage('Correo no válido'),
        body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
        body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
        body('estado').notEmpty().withMessage('El estado es obligatorio'),
        body('codigo_postal').notEmpty().withMessage('El código postal es obligatorio'),
        body('pais').notEmpty().withMessage('El país es obligatorio'),
        validateFields
    ],
    crearCliente
);

// Ruta para listar todos los clientes
router.get('/', listarClientes);

// Ruta para obtener un cliente por identificación
router.get('/identificacion/:identificacion', obtenerClientePorIdentificacion);

// Ruta para obtener un cliente por ID
router.get('/:id', obtenerClientePorId);


// Ruta para actualizar un cliente
router.put(
    '/:id',
    [
        body('correo').optional().isEmail().withMessage('Correo no válido'),
        validateFields
    ],
    actualizarCliente
);

// Ruta para eliminar un cliente (borrado lógico)
router.delete('/:id', eliminarCliente);

// Ruta para restaurar un cliente eliminado lógicamente
router.patch('/:id', cambiarEstadoCliente);

export default router;