import { Order, Customer, Product, InventoryTransaction } from '../models/index.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Obtener el total de registros de cada tabla
        const totalOrders = await Order.count();
        const totalCustomers = await Customer.count();
        const totalProducts = await Product.count();
        const totalTransactions = await InventoryTransaction.count();

        // Responder con los datos
        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalCustomers,
                totalProducts,
                totalTransactions,
            },
        });
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas del dashboard',
            error: error.message,
        });
    }
};
