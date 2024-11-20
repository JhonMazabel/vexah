import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTransaction, getTransactions } from '../services/inventoryApi';
import { getProductById } from '../services/productApi';
import '../scss/TransactionsScreen.scss';

const TransactionsScreen = () => {
    const { id_producto } = useParams();
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [cantidad, setCantidad] = useState('');
    const [tipo, setTipo] = useState('ENTRADA');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener transacciones y el nombre del producto
                const [transactionsData, productData] = await Promise.all([
                    getTransactions(id_producto),
                    getProductById(id_producto),
                ]);

                setTransactions(transactionsData);
                setProductName(productData.nombre_producto || 'Producto no encontrado');
            } catch (err) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_producto]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTransaction({ id_producto, cantidad: parseInt(cantidad), tipo });
            setCantidad('');
            setTipo('ENTRADA');
            const updatedTransactions = await getTransactions(id_producto); // Refrescar transacciones
            setTransactions(updatedTransactions);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la transacción');
        }
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div className="inventory-transactions-screen">
            <button className="back-button" onClick={() => navigate('/products')}>Volver</button>
            <h2>Transacciones de Inventario</h2>
            <h3>Producto: {productName}</h3>

            <form onSubmit={handleSubmit} className="transaction-form">
                <div>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <div>
                    <label>Tipo:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="ENTRADA">ENTRADA</option>
                        <option value="SALIDA">SALIDA</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Crear Transacción</button>
            </form>

            {error && <p className="error">{error}</p>}

            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cantidad</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id_transaccion}>
                            <td>{transaction.id_transaccion}</td>
                            <td>{transaction.cantidad}</td>
                            <td>
                                <span className={`label ${transaction.tipo.toLowerCase()}`}>
                                    {transaction.tipo}
                                </span>
                            </td>
                            <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsScreen;
