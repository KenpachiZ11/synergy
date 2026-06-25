import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  onClose?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Неверный email или пароль');
          return;
        }
      } else {
        if (!username.trim()) {
          setError('Введите имя пользователя');
          return;
        }
        const success = await register(username, email, password);
        if (!success) {
          setError('Пользователь с таким email уже существует');
          return;
        }
      }

      if (onClose) onClose();
    } catch (error) {
      setError('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        minWidth: '320px',
        maxWidth: '420px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            color: '#1F2937',
            fontSize: '1.875rem',
            fontWeight: '700'
          }}>
            {isLogin ? 'Вход' : 'Регистрация'}
          </h2>
          <p style={{
            color: '#6B7280',
            fontSize: '0.875rem',
            margin: 0
          }}>
            {isLogin ? 'Добро пожаловать!' : 'Создайте свой аккаунт'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="username" 
                style={{ 
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}
              >
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '12px',
                  backgroundColor: '#F9FAFB',
                  transition: 'all 0.2s ease'
                }}
                placeholder="Введите имя пользователя"
              />
            </div>
          )}
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email"
              style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                transition: 'all 0.2s ease'
              }}
              placeholder="Введите email"
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password"
              style={{ 
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                transition: 'all 0.2s ease'
              }}
              placeholder="Введите пароль"
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#EF4444',
              backgroundColor: '#FEF2F2',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '2rem' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                padding: '0.875rem 1.5rem',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.25)';
              }}
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTop: '1px solid #E5E7EB',
            paddingTop: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4F46E5',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#4338CA';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#4F46E5';
              }}
            >
              {isLogin ? 'Создать аккаунт' : 'Войти в аккаунт'}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: '1px solid #E5E7EB',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                Закрыть
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
