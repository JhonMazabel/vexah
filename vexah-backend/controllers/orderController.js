import { Order, OrderDetail, Product, Customer, InventoryTransaction, User } from '../models/index.js';
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
        const ordenes = await Order.findAll({ paranoid: false, include: [Customer, OrderDetail, User], order: [["id_orden", "desc"]] });
        res.status(200).json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las órdenes', error });
    }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await Order.findByPk(id, { paranoid: false, include: [Customer, OrderDetail, User], order: [["id_orden", "desc"]] });
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

export const exportarOrdenesPDF = async (req, res) => {
    try {
        const ordenes = await Order.findAll({
            include: [Customer, User],
            order: [['id_orden', 'desc']],
        });

        const doc = new PDFDocument({ margin: 30 });
        const fileName = 'listado_ordenes.pdf';
        const filePath = path.resolve(`./pdfs/${fileName}`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Función para agregar marca de agua
        const addWatermark = () => {
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const logoPath = path.resolve('./uploads/logo.png'); // Ruta al logo
            const logoSize = 200;

            doc.fillOpacity(0.1); // Establecer la opacidad antes de dibujar la imagen
            doc.image(logoPath, (pageWidth - logoSize) / 2, (pageHeight - logoSize) / 2, {
                width: logoSize,
            });
            doc.fillOpacity(1);
        };

        // Encabezado
        doc.fontSize(16).font('Helvetica-Bold').text('Listado de Órdenes', { align: 'center' });
        doc.moveDown();

        // Dimensiones de la tabla
        const tableTop = 100;
        const itemSpacing = 20;
        const colWidths = [50, 150, 150, 80, 80, 80]; // Anchos de columnas
        const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const offsetX = (pageWidth - totalTableWidth) / 2 + doc.page.margins.left;

        // Dibujar Encabezados de Tabla
        let y = tableTop;
        doc.fontSize(10).font('Helvetica-Bold');

        // Dibujar fila de encabezados
        const headers = ['ID Orden', 'Cliente', 'Asesor', 'Total', 'Fecha', 'Hora'];
        headers.forEach((header, i) => {
            doc.text(header, offsetX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
                width: colWidths[i],
                align: 'center',
            });
        });

        y += itemSpacing;

        // Dibujar contenido de la tabla
        doc.font('Helvetica');
        let totalSum = 0; // Para calcular la sumatoria del total

        ordenes.forEach((orden) => {
            // Actualizar la sumatoria
            totalSum += Math.round(orden.total);

            doc.text(orden.id_orden, offsetX, y, { width: colWidths[0], align: 'center' });
            doc.text(orden.Customer.nombre, offsetX + colWidths[0], y, { width: colWidths[1], align: 'center' });
            doc.text(orden.User.nombre, offsetX + colWidths[0] + colWidths[1], y, { width: colWidths[2], align: 'center' });
            doc.text(
                new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0, // Sin decimales
                }).format(orden.total),
                offsetX + colWidths[0] + colWidths[1] + colWidths[2],
                y,
                { width: colWidths[3], align: 'center' }
            );
            doc.text(
                orden.createdAt.toLocaleDateString('es-CO'),
                offsetX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                y,
                { width: colWidths[4], align: 'center' }
            );
            doc.text(
                orden.createdAt.toLocaleTimeString('es-CO'),
                offsetX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4],
                y,
                { width: colWidths[5], align: 'center' }
            );
            y += itemSpacing;

            // Si la posición actual excede la página, añade una nueva página
            if (y > doc.page.height - 50) {
                doc.addPage();
                addWatermark(); // Marca de agua para la nueva página
                y = tableTop;
            }
        });

        // Mostrar la sumatoria al final de la tabla
        y += itemSpacing;
        doc.font('Helvetica-Bold').text('Total General:', offsetX + colWidths[0] + colWidths[1] + colWidths[2], y, {
            width: colWidths[3],
            align: 'center',
        });
        doc.font('Helvetica').text(
            new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0, // Sin decimales
            }).format(totalSum),
            offsetX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
            y,
            { width: colWidths[3], align: 'center' }
        );

        // Agregar marca de agua a la primera página
        addWatermark();

        // Finalizar el documento PDF
        doc.end();

        writeStream.on('finish', () => {
            res.download(filePath, (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).json({ message: 'Error al descargar el archivo PDF', error: err });
                }
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error al escribir el archivo PDF:', err);
            res.status(500).json({ message: 'Error al crear el archivo PDF', error: err });
        });
    } catch (error) {
        console.error('Error al exportar las órdenes:', error);
        res.status(500).json({ message: 'Error al exportar las órdenes', error });
    }
};