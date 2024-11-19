import { Op } from 'sequelize';
import { Product } from '../models/index.js';

// Crear un nuevo producto (Solo Administrador)
export const crearProducto = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, stock } = req.body;
        let imagen_portada = null;

        // Si se sube una imagen, obtener la ruta del archivo
        if (req.file) {
            imagen_portada = req.file.path;
        }

        const nuevoProducto = await Product.create({
            nombre_producto,
            descripcion,
            precio,
            stock,
            imagen_portada
        });

        res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
};

// Listar todos los productos (Solo Administrador, incluyendo borrados)
export const listarTodosProductos = async (req, res) => {
    try {
        const { ordenar } = req.query;

        const order = [];
        if (ordenar && (ordenar === 'asc' || ordenar === 'desc')) {
            order.push(['precio', ordenar]);
        }

        const productos = await Product.findAll({ order: order, paranoid: false });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar todos los productos', error });
    }
};

// Listar productos activos (Cliente y Administrador)
export const listarProductosActivos = async (req, res) => {
    try {
        const { ordenar } = req.query;

        const order = [];
        if (ordenar && (ordenar === 'asc' || ordenar === 'desc')) {
            order.push(['precio', ordenar]);
        }

        const productos = await Product.findAll({
            order: order
        });
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los productos activos', error });
    }
};

// Obtener un producto por ID (Cliente y Administrador)
export const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

// Editar un producto (Solo Administrador)
export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre_producto, descripcion, precio, stock} = req.body;
    let imagen_portada = null;
  
    if (req.file) {
      imagen_portada = req.file.path;
    }
  console.log(imagen_portada);
    try {
      // Cambiar id por id_producto para buscar el producto por la clave primaria correcta
      const producto = await Product.findByPk(id);
  
      if (!producto) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
  
      producto.nombre_producto = nombre_producto || producto.nombre_producto;
      producto.descripcion = descripcion || producto.descripcion;
      producto.precio = precio || producto.precio;
      producto.stock = stock || producto.stock;
      producto.imagen_portada = imagen_portada || producto.imagen_portada;
  
      await producto.save();
  
      res.status(200).json({ message: 'Producto actualizado correctamente', producto });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
  };
  

// Eliminar un producto (Borrado lógico - Solo Administrador)
export const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        await producto.destroy(); // Borrado lógico

        res.status(200).json({ message: 'Producto eliminado correctamente (borrado lógico)' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

// Cambiar estado del producto (restaurar o eliminar lógicamente)
export const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Product.findByPk(id, { paranoid: false });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (producto.deletedAt) {
            await producto.restore(); // Restaurar el producto
            return res.status(200).json({ message: 'Producto restaurado correctamente' });
        } else {
            await producto.destroy(); // Borrado lógico
            return res.status(200).json({ message: 'Producto eliminado correctamente (borrado lógico)' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado del producto', error });
    }
};

export const buscarProductos = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({ message: 'El parámetro de búsqueda "nombre" es obligatorio' });
        }

        const productos = await Product.findAll({
            where: {
                nombre_producto: { [Op.like]: `%${nombre}%` }
            },
        });

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar productos', error });
    }
};