import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getStats } from '../services/dashboardApi';
import { FaShoppingCart, FaUsers, FaBoxOpen, FaExchangeAlt } from 'react-icons/fa';

import banner from '../assets/banner.png';
import '../scss/DashboardScreen.scss';

const DashboardScreen = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getStats();
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <p>Cargando estadísticas...</p>
            </div>
        );
    }

    return (
        <>
            <div className="header-image">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Volver
                </button>
                <img src={banner} alt="Banner" className="banner-image" />
            </div>

            <div className="dashboard">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="stats">
                    <div className="stat">
                        <FaShoppingCart className="stat-icon" />
                        <h3>Órdenes</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                    <div className="stat">
                        <FaUsers className="stat-icon" />
                        <h3>Clientes</h3>
                        <p>{stats.totalCustomers}</p>
                    </div>
                    <div className="stat">
                        <FaBoxOpen className="stat-icon" />
                        <h3>Productos</h3>
                        <p>{stats.totalProducts}</p>
                    </div>
                    <div className="stat">
                        <FaExchangeAlt className="stat-icon" />
                        <h3>Transacciones</h3>
                        <p>{stats.totalTransactions}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardScreen;