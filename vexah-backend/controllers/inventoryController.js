import { InventoryTransaction, Product, User } from '../models/index.js';

// Crear una nueva transacción de inventario
export const crearTransaccionInventario = async (req, res) => {
    const { id_producto, cantidad, tipo } = req.body;
    const id_usuario = req.user.id;

    try {
        // Validar que el producto exista
        const producto = await Product.findByPk(id_producto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar el stock del producto según el tipo de transacción
        if (tipo === 'ENTRADA') {
            producto.stock += cantidad;
        } else if (tipo === 'SALIDA' || tipo === 'VENTA') {
            if (producto.stock < cantidad) {
                return res.status(400).json({ message: 'Stock insuficiente para realizar la transacción' });
            }
            producto.stock -= cantidad;
        } else {
            return res.status(400).json({ message: 'Tipo de transacción no válido' });
        }

        await producto.save();

        // Crear la transacción de inventario
        const transaccion = await InventoryTransaction.create({
            id_producto,
            cantidad,
            tipo,
            id_usuario,
        });

        res.status(201).json({ message: 'Transacción de inventario creada exitosamente', transaccion });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la transacción de inventario', error });
    }
};

// Listar todas las transacciones de inventario
export const listarTransaccionesInventario = async (req, res) => {
    try {
        const transacciones = await InventoryTransaction.findAll({
            include: [
                { model: Product, attributes: ['nombre_producto'] },
                { model: User, attributes: ['nombre'] }
            ]
        });
        res.status(200).json(transacciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las transacciones de inventario', error });
    }
};

// Obtener una transacción de inventario por ID
export const obtenerTransaccionPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const transaccion = await InventoryTransaction.findByPk(id, {
            include: [
                { model: Product, attributes: ['nombre_producto'] },
                { model: User, attributes: ['nombre'] }
            ]
        });

        if (!transaccion) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        res.status(200).json(transaccion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la transacción de inventario', error });
    }
};

// Listar todas las transacciones de un producto específico por su ID
export const listarTransaccionesPorProducto = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const transacciones = await InventoryTransaction.findAll({
            where: { id_producto },
            include: [
                { model: Product, attributes: ['nombre_producto'] },
                { model: User, attributes: ['nombre'] }
            ]
        });

        if (transacciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron transacciones para el producto especificado' });
        }

        res.status(200).json(transacciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las transacciones del producto', error });
    }
};