import { Order, OrderDetail, Product, Customer, InventoryTransaction } from '../models/index.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Crear una nueva orden
export const crearOrden = async (req, res) => {
    const { id_cliente, productos } = req.body;
    const id_asesor = req.user.id;

    try {
        let total = 0;

        // Crear la orden
        const nuevaOrden = await Order.create({ id_cliente, id_asesor, total: 0 });

        // Procesar cada producto y crear detalles de la orden
        for (const producto of productos) {
            const productoDB = await Product.findByPk(producto.id_producto);

            if (!productoDB) {
                return res.status(404).json({ message: `Producto con id ${producto.id_producto} no encontrado` });
            }

            if (productoDB.stock < producto.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${productoDB.nombre_producto}` });
            }

            // Reducir el stock del producto
            productoDB.stock -= producto.cantidad;
            await productoDB.save();

            // Calcular el total
            total += producto.cantidad * productoDB.precio;

            // Crear el detalle de la orden
            await OrderDetail.create({
                id_orden: nuevaOrden.id_orden,
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                precio_unitario: productoDB.precio,
            });

            // Registrar la transacción de inventario (tipo: 'VENTA')
            await InventoryTransaction.create({
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                tipo: 'VENTA',
                id_usuario: id_asesor,
            });
        }

        // Actualizar el total de la orden
        nuevaOrden.total = total;
        await nuevaOrden.save();

        res.status(201).json({ message: 'Orden creada exitosamente', orden: nuevaOrden });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear la orden', error });
    }
};

// Listar todas las órdenes, incluyendo las eliminadas lógicamente
export const listarOrdenes = async (req, res) => {
    try {
        const ordenes = await Order.findAll({ paranoid: false, include: [Customer, OrderDetail] });
        res.status(200).json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las órdenes', error });
    }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await Order.findByPk(id, { paranoid: false, include: [Customer, OrderDetail] });
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.status(200).json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error });
    }
};

// Actualizar una orden
export const actualizarOrden = async (req, res) => {
    const { id } = req.params;
    const { productos } = req.body;

    try {
        const orden = await Order.findByPk(id, { include: [OrderDetail] });

        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Revertir el stock a la cantidad previa de cada producto
        for (const detalle of orden.OrderDetails) {
            const productoDB = await Product.findByPk(detalle.id_producto);
            if (productoDB) {
                productoDB.stock += detalle.cantidad;
                await productoDB.save();
            }

            // Eliminar transacción de inventario previa relacionada con este detalle
            await InventoryTransaction.destroy({
                where: {
                    id_producto: detalle.id_producto,
                    id_usuario: orden.id_asesor,
                    tipo: 'VENTA'
                }
            });
        }

        // Eliminar los detalles de la orden previa
        await OrderDetail.destroy({ where: { id_orden: orden.id_orden } });

        // Crear nuevos detalles y registrar transacciones
        let total = 0;

        for (const producto of productos) {
            const productoDB = await Product.findByPk(producto.id_producto);

            if (!productoDB) {
                return res.status(404).json({ message: `Producto con id ${producto.id_producto} no encontrado` });
            }

            if (productoDB.stock < producto.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${productoDB.nombre_producto}` });
            }

            // Reducir el stock del producto
            productoDB.stock -= producto.cantidad;
            await productoDB.save();

            // Calcular el total
            total += producto.cantidad * productoDB.precio;

            // Crear el detalle de la orden
            await OrderDetail.create({
                id_orden: orden.id_orden,
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                precio_unitario: productoDB.precio,
            });

            // Registrar la transacción de inventario (tipo: 'VENTA')
            await InventoryTransaction.create({
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                tipo: 'VENTA',
                id_usuario: orden.id_asesor,
            });
        }

        // Actualizar el total de la orden
        orden.total = total;
        await orden.save();

        res.status(200).json({ message: 'Orden actualizada correctamente', orden });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la orden', error });
    }
};

// Borrar una orden (borrado lógico)
export const eliminarOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await Order.findByPk(id);
        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        await orden.destroy(); // Borrado lógico
        res.status(200).json({ message: 'Orden eliminada correctamente (borrado lógico)' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la orden', error });
    }
};

// Restaurar una orden eliminada lógicamente
export const cambiarEstadoOrden = async (req, res) => {
    const { id } = req.params;

    try {
        const orden = await Order.findByPk(id, { paranoid: false });

        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada o no eliminada' });
        }

        if (orden.deletedAt) {
            await orden.restore();
            return res.status(200).json({ message: 'Orden restaurada correctamente' });
        } else {
            await orden.destroy(); // Borrado lógico
            return res.status(200).json({ message: 'Orden eliminada correctamente (borrado lógico)' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al restaurar la orden', error });
    }
};

// Imprimir una orden (generar un archivo PDF para impresora térmica 80mm)
export const imprimirOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await Order.findByPk(id, {
            include: [
                Customer,
                {
                    model: OrderDetail,
                    include: [Product]
                }
            ],
        });

        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument({
            size: [227, 800], // 80mm de ancho, altura ajustable
            margin: 10
        });

        // Definir el nombre del archivo PDF
        const fileName = `orden_${orden.id_orden}.pdf`;
        const filePath = path.resolve(`./pdfs/${fileName}`);

        // Crear un stream para guardar el PDF
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Agregar el logo al PDF
        const logoPath = path.resolve('./uploads/logo.png');
        doc.image(logoPath, {
            fit: [100, 50], // Ajusta el tamaño del logo
            align: 'center',
        }).moveDown(5); // Agregar más espacio después del logo

        // Encabezado del PDF
        doc.fontSize(14).font('Helvetica-Bold').text('ORDEN DE COMPRA', { align: 'center' })
            .moveDown()
            .fontSize(10)
            .font('Helvetica')
            .text(`ID Orden: ${orden.id_orden}`)
            .text(`Cliente: ${orden.Customer.nombre}`)
            .text(`Identificación: ${orden.Customer.identificacion}`)
            .text(`Fecha: ${orden.createdAt.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`)
            .moveDown()
            .text('-----------------------------', { align: 'center' });

        // Detalles de los productos en la orden
        orden.OrderDetails.forEach((detalle) => {
            const totalProducto = detalle.cantidad * detalle.precio_unitario;
            doc.fontSize(10)
                .font('Helvetica-Bold')
                .text(`Producto: ${detalle.Product.nombre_producto}`)
                .font('Helvetica')
                .text(`Cantidad: ${detalle.cantidad}`)
                .text(`Precio Unitario: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(detalle.precio_unitario)}`)
                .text(`Total: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalProducto)}`)
                .moveDown()
                .text('-----------------------------', { align: 'center' });
        });

        // Total de la orden
        doc.moveDown()
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Total: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(orden.total)}`, { align: 'right' })
            .moveDown()
            .fontSize(14)
            .text('GRACIAS POR SU COMPRA', { align: 'center' });

        // Finalizar el documento PDF
        doc.end();

        // Cuando el archivo esté listo para ser enviado
        writeStream.on('finish', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).json({ message: 'Error al descargar el archivo PDF', error: err });
                } else {
                    console.log('Archivo PDF descargado con éxito');
                }
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error al escribir el archivo PDF:', err);
            res.status(500).json({ message: 'Error al crear el archivo PDF', error: err });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al imprimir la orden', error });
    }
};
