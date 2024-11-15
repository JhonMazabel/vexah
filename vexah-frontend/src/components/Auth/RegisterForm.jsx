// src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { registerUser } from '../../services/authApi';

const RegisterForm = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser({
        nombre,
        correo: email,
        contraseña: password,
        rol_id: parseInt(roleId),
      });
      setMessage('Registro exitoso');
      console.log(data);
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="register-form container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-3">
          <label className="form-label">Rol ID</label>
          <input
            type="number"
            className="form-control"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
