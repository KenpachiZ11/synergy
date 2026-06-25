import React, { useState } from 'react';
import { authAPI, usersAPI } from '../api';
import { v4 as uuidv4 } from 'uuid';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.checkUser(formData.username, formData.password);
      if (response.data.length > 0) {
        const user = response.data[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.email || !formData.name || !formData.password) {
      setError('Заполните все поля');
      setLoading(false);
      return;
    }

    try {
      const existingUsers = await usersAPI.getAll();
      const userExists = existingUsers.data.some(
        user => user.username === formData.username || user.email === formData.email
      );

      if (userExists) {
        setError('Пользователь с таким именем или email уже существует');
        setLoading(false);
        return;
      }

      const newUser = {
        id: uuidv4(),
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password,
        createdAt: new Date().toISOString(),
      };

      const response = await usersAPI.create(newUser);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      onLogin(response.data);
    } catch (err) {
      setError('Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (username, password) => {
    setFormData({
      ...formData,
      username,
      password,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Полное имя</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        {isLogin && (
          <div className="debug-buttons">
            <p className="debug-title">Отладочные аккаунты:</p>
            <div className="debug-buttons-grid">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleTestLogin('tester1', 'test')}
                disabled={loading}
              >
                Войти как Tester1
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleTestLogin('tester2', 'test')}
                disabled={loading}
              >
                Войти как Tester2
              </button>
            </div>
          </div>
        )}

        <div className="auth-switch">
          <p>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт?'}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  username: '',
                  email: '',
                  name: '',
                  password: '',
                });
              }}
            >
              {isLogin ? ' Зарегистрироваться' : ' Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
