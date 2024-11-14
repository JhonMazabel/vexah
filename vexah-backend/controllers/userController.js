import User from '../models/User.js';

// Crear nuevo usuario (Solo Administrador)
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, clave, rol } = req.body;

        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { correo } });

        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(clave, 10);

        // Crear el usuario
        const usuario = await User.create({ nombre, correo, clave: hashedPassword, rol });
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

// Cambiar estado del usuario (Borrado lógico o recuperación - Solo Administrador)
export const cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        // Incluir usuarios eliminados lógicamente (paranoid: false)
        const usuario = await User.findByPk(id, { paranoid: false });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario está eliminado
        if (usuario.deletedAt) {
            // Si está eliminado, restaurarlo
            await usuario.restore();
            return res.status(200).json({ message: 'Usuario recuperado correctamente' });
        } else {
            // Si no está eliminado, realizar un borrado lógico
            await usuario.destroy();
            return res.status(200).json({ message: 'Usuario eliminado correctamente (borrado lógico)' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado del usuario', error });
    }
};

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

// GET /usuarios/:id - Obtener un usuario por ID (Solo Administrador)
export const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findByPk(id, {
            paranoid: false // Incluir registros eliminados lógicamente
        });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
};

// PUT /usuarios/:id - Actualizar la información del usuario (Solo Administrador)
export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, rol, clave } = req.body;

    try {
        const usuario = await User.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos condicionalmente
        usuario.nombre = nombre || usuario.nombre;
        usuario.correo = correo || usuario.correo;
        usuario.rol = rol || usuario.rol;

        // Si se proporciona la clave, realizar el hash y actualizarla
        if (clave) {
            if (clave.length < 6) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            }
            usuario.clave = await bcrypt.hash(clave, 10);
        }

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