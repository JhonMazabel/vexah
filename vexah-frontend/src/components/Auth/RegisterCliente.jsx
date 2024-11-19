// src/components/Client/RegisterClientForm.jsx
import React, { useState } from 'react';
import { registerClient } from '../../services/customerApi';

const RegisterClientForm = () => {
  const [nombre, setNombre] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [pais, setPais] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerClient({
        nombre,
        identificacion,
        correo,
        telefono,
        direccion,
        ciudad,
        estado,
        codigo_postal: codigoPostal,
        pais,
      });
      setMessage('Cliente registrado exitosamente');
      console.log(data);
    } catch (err) {
      setError(err.message || 'Error al registrar cliente');
    }
  };

  return (
    <div className="register-client-form container">
      <h2>Registrar Cliente</h2>
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
          <label className="form-label">Identificación</label>
          <input
            type="text"
            className="form-control"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input
            type="text"
            className="form-control"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Estado</label>
          <input
            type="text"
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Código Postal</label>
          <input
            type="text"
            className="form-control"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">País</label>
          <input
            type="text"
            className="form-control"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar Cliente</button>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterClientForm;