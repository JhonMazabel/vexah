// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { loginUser } from '../../services/authApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ correo: email, contraseña: password });
      setMessage('Inicio de sesión exitoso');
      // Aquí puedes manejar el inicio de sesión, como guardar un token en localStorage o redirigir al usuario
      console.log(data);
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
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
