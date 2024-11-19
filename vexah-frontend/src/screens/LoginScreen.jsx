// src/screens/LoginScreen.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import RegisterClientForm from '../components/Auth/RegisterCliente';
import { AuthContext } from '../context/AuthContext'; // Importar el contexto de autenticación

import logo from '../assets/logo.png';
import '../scss/LoginScreen.scss';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('options'); // Estado para controlar qué formulario mostrar
  const { user, logout } = useContext(AuthContext); // Obtener el usuario autenticado y la función de cerrar sesión del contexto

  const handleLogout = () => {
    logout(); // Llamar a la función de cerrar sesión
    navigate('/login'); // Redirigir al login
  };

  console.log({user});

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <div className="form-container">
            <button className="back-button" onClick={() => setView('options')}>
              <FaArrowLeft /> Volver
            </button>
            <LoginForm /> {/* Renderiza el formulario de inicio de sesión */}
          </div>
        );
      case 'register':
        return (
          <div className="form-container">
            <button className="back-button" onClick={() => setView('options')}>
              <FaArrowLeft /> Volver
            </button>
            <RegisterForm /> {/* Renderiza el formulario de registro */}
          </div>
        );
      case 'registerClient':
        return (
          <div className="form-container">
            <button className="back-button" onClick={() => setView('options')}>
              <FaArrowLeft /> Volver
            </button>
            <RegisterClientForm /> {/* Renderiza el formulario de registro de cliente */}
          </div>
        );
      default:
        return (
          <div className="button-group">
            {user ? (
              <>
                <button className="btn" onClick={handleLogout}>Cerrar Sesión</button>
                {user.rol === 'ADMINISTRADOR' && (
                  <button className="btn" onClick={() => setView('register')}>
                    Registrar Asesor Comercial
                  </button>
                )}
                <button className="btn" onClick={() => setView('registerClient')}>Registrar Cliente</button>
                <button className="btn" onClick={() => navigate('/products')}>Ver Productos</button>
                <button className="btn" onClick={() => navigate('/orders')}>Ver Ordenes</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => setView('login')}>Ingresar</button>
                <button className="btn" onClick={() => setView('registerClient')}>Registrar Cliente</button>
                <button className="btn" onClick={() => navigate('/products')}>Ver Productos</button>
                <button className="btn" onClick={() => navigate('/orders')}>Ver Ordenes</button>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="login-screen">
      {/* Sección izquierda con el logo */}
      <div className="left-section">
        <img src={logo} alt="Vexah Logo" className="logo" />
      </div>

      {/* Sección derecha */}
      <div className="right-section">
        <h2>Bienvenido{user ? `, ${user.rol}` : ''}</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginScreen;