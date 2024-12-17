import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' }); // Errores en tiempo real
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // Validaciones en tiempo real
    if (name === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setFieldErrors((prev) => ({
        ...prev,
        email: isValidEmail ? '' : 'Correo electrónico no válido',
      }));
    }

    if (name === 'password') {
      setFieldErrors((prev) => ({
        ...prev,
        password: value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Activar el loader

    try {
      const success = await login(user.email, user.password);
      if (success) {
        navigate('/');
      } else {
        setError('Error de autenticación. Verifica tus credenciales.');
      }
    } catch (err) {
      setError('Hubo un problema con el servidor.');
    } finally {
      setIsLoading(false); // Desactivar el loader
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Ingresa tu correo"
          required
        />
        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          required
        />
        {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}

        <button type="submit" className="btn-submit" disabled={isLoading || fieldErrors.email || fieldErrors.password}>
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
