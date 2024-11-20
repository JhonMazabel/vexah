// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { loginUser } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de usar el named export

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ correo: email, clave: password }); // Inicia sesión
      localStorage.setItem('token', data.token); // Guarda el token en localStorage

      // Decodifica el token para obtener el rol del usuario
      const decoded = jwtDecode(data.token);

      // Redirige según el rol del usuario
      if (decoded.rol === 'ADMINISTRADOR') {
        navigate('/dashboard'); // Página específica para administradores
      } else if (decoded.rol === 'ASESOR_VENTAS') {
        navigate('/products'); // Página específica para asesores de ventas
      } else {
        navigate('/'); // Página por defecto
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-form container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
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