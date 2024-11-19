import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Almacena los datos decodificados del usuario
  const [token, setToken] = useState(localStorage.getItem('token')); // Almacena el token de autenticación

  // Decodificar el token y establecer el usuario al cargar el contexto
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Almacena los datos del usuario decodificados
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, [token]);

  // Función para iniciar sesión
  const login = (newToken) => {
    localStorage.setItem('token', newToken); // Guarda el token en localStorage
    setToken(newToken);
    
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded); // Almacena los datos del usuario decodificados
    } catch (error) {
      console.error('Error al decodificar el token después del login:', error);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token de localStorage
    setToken(null);
    setUser(null); // Limpia los datos del usuario
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
