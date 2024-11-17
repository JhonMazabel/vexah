import crypto from "crypto";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { User } from '../models/index.js';

import { sendEmail } from '../config/email.js';

export const register = async (req, res) => {
    try {
        const { nombre, correo, clave } = req.body;

        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(clave, 10);

        // Crear el usuario
        const user = await User.create({ nombre, correo, clave: hashedPassword });
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, clave } = req.body;
        const user = await User.scope('withPassword').findOne({ where: { correo } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(clave, user.clave);
        if (!isPasswordValid) return res.status(401).json({ message: 'Clave incorrecta' });

        const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error en el inicio de sesión', error });
    }
};

// Solicitud de recuperación de contraseña
export const requestPasswordReset = async (req, res) => {
    const { correo } = req.body;

    try {
        const user = await User.findOne({ where: { correo } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expirationDate = new Date(Date.now() + 3600000); // Token válido por 1 hora

        await user.update({
            token_recuperacion: token,
            expiracion_token: expirationDate,
        });

        const resetLink = `http://localhost:3001/reset-password/${token}`;
        const emailContent = `
        <h3>Recuperación de Contraseña</h3>
        <p>Haga clic en el siguiente enlace para restablecer su clave:</p>
        <a href="${resetLink}">Restablecer Clave</a>
        `;

        await sendEmail(user.correo, 'Recuperación de Contraseña', emailContent);
        res.json({ message: 'Correo de recuperación enviado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error en la solicitud de recuperación', error });
    }
};

// Restablecer contraseña
export const resetPassword = async (req, res) => {
    const { token, nuevaClave } = req.body;

    try {
        const user = await User.findOne({
            where: {
                token_recuperacion: token,
                expiracion_token: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado'});
        }

        const hashedPassword = await bcrypt.hash(nuevaClave, 10);

        await user.update({
            clave: hashedPassword,
            token_recuperacion: null,
            expiracion_token: null,
        });

        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al restablecer la contraseña', error });
    }
};