import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onShowAuth: () => void;
  onShowPostForm: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onShowAuth, onShowPostForm, currentView, onViewChange }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onViewChange('public');
  };

  const navButtonStyle = (view: string) => ({
    backgroundColor: currentView === view ? '#4F46E5' : 'transparent',
    color: currentView === view ? 'white' : '#374151',
    padding: '0.5rem 1rem',
    border: currentView === view ? 'none' : '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '0.5rem',
    fontWeight: '500',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
    boxShadow: currentView === view ? '0 2px 8px rgba(79, 70, 229, 0.25)' : 'none',
    ':hover': {
      backgroundColor: currentView === view ? '#4338CA' : '#F9FAFB'
    }
  });

  return (
    <header style={{
      backgroundColor: 'white',
      padding: '1rem 0',
      borderBottom: '1px solid #E5E7EB',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#1F2937',
          fontSize: '1.875rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Мой Блог
        </h1>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => onViewChange('public')}
            style={navButtonStyle('public')}
          >
            Публичные
          </button>
          
          {currentUser && (
            <>
              <button
                onClick={() => onViewChange('subscription')}
                style={navButtonStyle('subscription')}
              >
                Подписки
              </button>
              
              <button
                onClick={() => onViewChange('my')}
                style={navButtonStyle('my')}
              >
                Мои
              </button>
              
              <button
                onClick={() => onViewChange('request-only')}
                style={navButtonStyle('request-only')}
              >
                По запросу
              </button>
              
              <button
                onClick={() => onViewChange('access-requests')}
                style={navButtonStyle('access-requests')}
              >
                Запросы
              </button>
              
              <button
                onClick={() => onViewChange('users')}
                style={navButtonStyle('users')}
              >
                Пользователи
              </button>
              
              <button
                onClick={onShowPostForm}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.25)';
                }}
              >
                Создать
              </button>
            </>
          )}
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser ? (
            <>
              
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  marginLeft: '1rem',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
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
              Войти / Регистрация
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
