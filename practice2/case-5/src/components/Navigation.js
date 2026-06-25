import React from 'react';

const Navigation = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'travels', label: 'Все путешествия' },
    { id: 'my-travels', label: 'Мои путешествия' },
    { id: 'add-travel', label: 'Добавить путешествие' },
    { id: 'users', label: 'Пользователи' },
  ];

  return (
    <nav className="nav">
      <div className="container">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
