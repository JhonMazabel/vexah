import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const create = async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol_id } = req.body;

        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Crear el usuario
        const user = await User.create({ nombre, correo, contraseña: hashedPassword, rol_id });
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const user = await User.findOne({ where: { correo } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id_usuario, rol: user.rol_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error });
    }
};
