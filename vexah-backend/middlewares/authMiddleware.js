import jwt from "jsonwebtoken";

// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Middleware de autorización
export const authorizeRole = (role) => (req, res, next) => {
    if (req.user.rol !== role) {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
    }
    next();
};