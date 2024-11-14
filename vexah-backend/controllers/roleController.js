import Role from '../models/Role.js';

export const createRole = async (req, res) => {
    try {
        const { nombre_rol, descripcion } = req.body;
        const role = await Role.create({ nombre_rol, descripcion });
        res.status(201).json({ message: 'Rol creado exitosamente', role });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol', error });
    }
};

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles', error });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el rol', error });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_rol, descripcion } = req.body;
        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });

        role.nombre_rol = nombre_rol;
        role.descripcion = descripcion;
        await role.save();

        res.status(200).json({ message: 'Rol actualizado exitosamente', role });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });

        await role.destroy();
        res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol', error });
    }
};