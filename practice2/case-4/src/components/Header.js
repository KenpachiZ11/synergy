import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User, Settings } from 'lucide-react';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <a href="#" className="logo">
          <BookOpen size={24} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Книжный магазин
        </a>
        
        <nav className="nav">
          <a 
            href="#"
            className={`nav-link ${currentView === 'books' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('books');
            }}
          >
            Каталог книг
          </a>
          
          {user?.role === 'admin' && (
            <a 
              href="#"
              className={`nav-link ${currentView === 'admin' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('admin');
              }}
            >
              <Settings size={16} style={{ marginRight: '0.25rem', display: 'inline' }} />
              Панель администратора
            </a>
          )}
          
          {user?.role === 'user' && (
            <a 
              href="#"
              className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('profile');
              }}
            >
              <User size={16} style={{ marginRight: '0.25rem', display: 'inline' }} />
              Мои книги
            </a>
          )}
        </nav>

        <div className="user-info">
          <span>Добро пожаловать, {user?.name || user?.username}</span>
          <button onClick={logout} className="logout-btn">
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
