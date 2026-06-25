import React from 'react';

const UserCard = ({ user, travelsCount }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="card">
      <div className="card-content">
        <div className="user-info">
          <div className="user-icon">👤</div>
          <div>
            <h3 className="card-title">{user.name}</h3>
            <p className="card-subtitle">@{user.username}</p>
            <p className="card-subtitle">{user.email}</p>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <div className="badge badge-primary">
            Путешествий: {travelsCount}
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
          Зарегистрирован: {formatDate(user.createdAt)}
        </div>
      </div>
    </div>
  );
};

const UsersList = ({ users, travels, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem' }}>Загрузка пользователей...</span>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        <h3>Пользователей не найдено</h3>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Пользователи системы</h2>
      <div className="grid grid-3">
        {users.map((user) => {
          const userTravelsCount = travels.filter(travel => travel.userId === user.id).length;
          return (
            <UserCard
              key={user.id}
              user={user}
              travelsCount={userTravelsCount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UsersList;
