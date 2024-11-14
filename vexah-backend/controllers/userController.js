import User from '../models/User.js';

// Consultar todos los usuarios, incluidos los eliminados lógicamente
export const listarTodosUsuarios = async (req, res) => {
    try {
        const users = await User.findAll({
            paranoid: false // Incluye registros eliminados lógicamente
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar usuarios', error });
    }
};

// PUT /usuarios/:id - Actualizar la información del usuario (Solo Administrador)
export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;

    try {
        const usuario = await User.findByPk(id);
        if (!usuario || !usuario.activo) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre || usuario.nombre;
        usuario.correo = correo || usuario.correo;
        usuario.rol = rol || usuario.rol;

        await usuario.save();
        res.status(200).json({ message: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};

// DELETE /usuarios/:id - Borrado lógico de un usuario (Solo Administrador)
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy(); // Borrado lógico
        res.status(200).json({ message: 'Usuario eliminado correctamente (borrado lógico)' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
};
