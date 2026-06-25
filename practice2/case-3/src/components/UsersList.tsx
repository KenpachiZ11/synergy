import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UsersList: React.FC = () => {
  const { currentUser, users, followUser, unfollowUser } = useAuth();

  const handleFollowToggle = async (userId: string) => {
    if (!currentUser) return;

    try {
      if (currentUser.followings.includes(userId)) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Ошибка при изменении подписки:', error);
    }
  };

  const filteredUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div>
      <h2>Пользователи</h2>
      {filteredUsers.length === 0 ? (
        <p>Нет других пользователей</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredUsers.map(user => {
            const isFollowing = currentUser?.followings.includes(user.id) || false;
            
            return (
              <div
                key={user.id}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{user.username}</h4>
                  <p style={{ margin: '0', color: '#6c757d', fontSize: '0.875rem' }}>
                    Email: {user.email}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
                    Подписчиков: {user.followers.length} | Подписок: {user.followings.length}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
                    Зарегистрирован: {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                {currentUser && (
                  <button
                    onClick={() => handleFollowToggle(user.id)}
                    style={{
                      backgroundColor: isFollowing ? '#dc3545' : '#28a745',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {isFollowing ? 'Отписаться' : 'Подписаться'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UsersList;
