import { Customer } from '../models/index.js';

// Crear un nuevo cliente
export const crearCliente = async (req, res) => {
    try {
        const { nombre, identificacion, correo, telefono, direccion, ciudad, estado, codigo_postal, pais } = req.body;

        // Verificar si el correo o la identificación ya están registrados
        const clienteExistente = await Customer.findOne({ where: { identificacion } });

        if (clienteExistente) {
            return res.status(400).json({ message: 'El cliente ya está registrado' });
        }

        const nuevoCliente = await Customer.create({
            nombre,
            identificacion,
            correo,
            telefono,
            direccion,
            ciudad,
            estado,
            codigo_postal,
            pais
        });

        res.status(201).json({ message: 'Cliente creado exitosamente', cliente: nuevoCliente });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cliente', error });
    }
};

// Listar todos los clientes, incluyendo los eliminados lógicamente
export const listarClientes = async (req, res) => {
    try {
        const clientes = await Customer.findAll({ paranoid: false });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los clientes', error });
    }
};

// Obtener un cliente por ID
export const obtenerClientePorId = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Customer.findByPk(id, { paranoid: false });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error });
    }
};

// Obtener un cliente por identificación
export const obtenerClientePorIdentificacion = async (req, res) => {
    const { identificacion } = req.params;

    try {
        const cliente = await Customer.findOne({ where: { identificacion }, paranoid: false });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente por identificación', error });
    }
};

// Actualizar un cliente
export const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, identificacion, correo, telefono, direccion, ciudad, estado, codigo_postal, pais } = req.body;

    try {
        const cliente = await Customer.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Actualizar los campos del cliente
        cliente.nombre = nombre || cliente.nombre;
        cliente.identificacion = identificacion || cliente.identificacion;
        cliente.correo = correo || cliente.correo;
        cliente.telefono = telefono || cliente.telefono;
        cliente.direccion = direccion || cliente.direccion;
        cliente.ciudad = ciudad || cliente.ciudad;
        cliente.estado = estado || cliente.estado;
        cliente.codigo_postal = codigo_postal || cliente.codigo_postal;
        cliente.pais = pais || cliente.pais;

        await cliente.save();
        res.status(200).json({ message: 'Cliente actualizado correctamente', cliente });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente', error });
    }
};

// Borrar un cliente (borrado lógico)
export const eliminarCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await Customer.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await cliente.destroy(); // Borrado lógico
        res.status(200).json({ message: 'Cliente eliminado correctamente (borrado lógico)' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error });
    }
};

// Restaurar un cliente eliminado lógicamente
export const cambiarEstadoCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await Customer.findByPk(id, { paranoid: false });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado o no eliminado' });
        }

        if (cliente.deletedAt) {
            await cliente.restore();
            return res.status(200).json({ message: 'Cliente restaurado correctamente' });
        } else {
            await cliente.destroy(); // Borrado lógico
            return res.status(200).json({ message: 'Cliente eliminado correctamente (borrado lógico)' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al restaurar el cliente', error });
    }
};