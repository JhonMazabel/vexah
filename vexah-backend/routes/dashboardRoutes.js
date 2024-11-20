import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Ruta para obtener estadísticas del dashboard
router.get('/stats', getDashboardStats);

export default router;