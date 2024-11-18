// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { loginUser } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ correo: email, clave: password }); // Asegúrate de que el payload coincida con el backend
      localStorage.setItem('token', data.token); // Guarda el token en localStorage
      navigate('/products'); // Redirige a la pantalla de productos
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-form container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        {error && <p className="text-danger">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
