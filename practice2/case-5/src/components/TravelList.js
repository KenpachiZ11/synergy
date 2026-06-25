import React from 'react';

const TravelList = ({ travels, users, onEdit, onDelete, currentUserId, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '1rem' }}>Загрузка путешествий...</span>
      </div>
    );
  }

  if (!travels || travels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        <h3>Путешествий пока нет</h3>
        <p>Станьте первым, кто поделится своим путешествием!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-2">
      {travels.map((travel) => {
        const user = users.find(u => u.id === travel.userId);
        return (
          <TravelCard
            key={travel.id}
            travel={travel}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        );
      })}
    </div>
  );
};

export default TravelList;
