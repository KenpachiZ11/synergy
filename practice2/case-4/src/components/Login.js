import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Login = () => {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const { login, loading, error, clearError } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(credentials);
  };

  const fillDemoCredentials = (role) => {
    setCredentials(
      role === 'admin' 
        ? { username: 'admin', password: 'admin123' }
        : { username: 'user', password: 'user123' }
    );
    showInfo(`Заполнены данные для ${role === 'admin' ? 'администратора' : 'пользователя'}`);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход в систему</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
            Демо-аккаунты:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
            >
              Администратор
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('user')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
            >
              Пользователь
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
