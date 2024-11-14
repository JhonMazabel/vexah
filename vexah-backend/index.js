import express from "express";
import cors from 'cors';
import db from "./config/db.js";
import dotenv from 'dotenv';

// Rutas
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Leer Variables de Entornos
dotenv.config();

// Iniciar Aplicación Express
const app = express();
app.use(cors());

// Habilitar la lectura de datos por JSON y por Formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log("Conexión Correcta a la base de datos");
} catch (error) {
    console.log(error);
}

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Inicializar Puerto
app.listen(process.env.PORT, () => console.log(`Servidor iniciado en el puerto ${process.env.PORT}`));