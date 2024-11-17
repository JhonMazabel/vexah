import express from "express";
import cors from 'cors';
import db from "./config/db.js";
import dotenv from 'dotenv';
import path from 'path';
// Rutas
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

// Leer Variables de Entornos
dotenv.config();

// Iniciar Aplicación Express
const app = express();
app.use(cors());

// Habilitar la lectura de datos por JSON y por Formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Servir la carpeta 'uploads' y 'pdfs' de manera estática para que los archivos sean accesibles
app.use('/uploads', express.static('uploads'));
app.use('/pdfs', express.static('pdfs'));

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
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Inicializar Puerto
app.listen(process.env.PORT, () => console.log(`Servidor iniciado en el puerto ${process.env.PORT}`));