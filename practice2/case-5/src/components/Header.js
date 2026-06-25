import React from 'react';

const Header = ({ currentUser, onLogout }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">Дневник путешествий</h1>
          {currentUser && (
            <div className="user-info">
              <span className="welcome-text">Добро пожаловать, {currentUser.name}!</span>
              <button onClick={onLogout} className="btn btn-secondary btn-sm">
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
