// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

import logo from '../assets/logo.png';
import '../scss/LoginScreen.scss';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('options'); // Estado para controlar qué formulario mostrar

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
      default:
        return (
          <div className="button-group">
            <button className="btn" onClick={() => setView('login')}>Ingresar</button>
            <button className="btn" onClick={() => setView('register')}>Registrarse</button>
            <button className="btn" onClick={() => navigate('/products')}>Ver Productos</button>
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
        <h2>Bienvenido(a)</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginScreen;
