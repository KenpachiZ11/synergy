import React from 'react';

const TravelCard = ({ travel, user, onEdit, onDelete, onLike, currentUserId, likesCount, isLiked }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <div
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      />
    ));
  };

  const getRatingLabel = (key) => {
    const labels = {
      transportation: 'Транспорт',
      safety: 'Безопасность',
      population: 'Населенность',
      nature: 'Природа',
    };
    return labels[key] || key;
  };

  return (
    <div className="card travel-card">
      <div className="card-header">
        <div className="user-info">
          <div className="user-icon">👤</div>
          <div>
            <div className="user-name">{user?.name || 'Неизвестный пользователь'}</div>
            <div className="card-subtitle">
              {formatDate(travel.createdAt)}
            </div>
          </div>
        </div>
        <h3 className="card-title">{travel.title}</h3>
      </div>

      <div className="card-content">
        <div className="travel-meta">
          <div className="travel-meta-item travel-location">
            <span>📍</span>
            <span>{travel.location.name}</span>
          </div>
          <div className="travel-meta-item travel-dates">
            <span>📅</span>
            <span>{formatDate(travel.startDate)} - {formatDate(travel.endDate)}</span>
          </div>
          <div className="travel-meta-item travel-cost">
            <span>💰</span>
            <span>{formatCurrency(travel.cost, travel.currency)}</span>
          </div>
        </div>

        <div className="travel-description">
          {travel.description}
        </div>

        {travel.images && travel.images.length > 0 && (
          <div className="travel-images">
            {travel.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${travel.title} - фото ${index + 1}`}
                className="travel-image"
              />
            ))}
          </div>
        )}

        <div className="travel-sections">
          <div className="travel-section">
            <h4>Культурные места</h4>
            <ul>
              {travel.culturalSites?.map((site, index) => (
                <li key={index}>{site}</li>
              ))}
            </ul>
          </div>

          <div className="travel-section">
            <h4>Места для посещения</h4>
            <ul>
              {travel.placesToVisit?.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ratings">
          {Object.entries(travel.ratings || {}).map(([key, value]) => (
            <div key={key} className="rating-item">
              <div className="rating-label">{getRatingLabel(key)}</div>
              <div className="rating-value">{value}/5</div>
              <div className="rating-stars">
                {renderStars(value)}
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions">
          <button
            className={`btn btn-like ${isLiked ? 'liked' : ''}`}
            onClick={() => onLike(travel.id)}
            disabled={!currentUserId}
          >
            ♥ {likesCount || 0}
          </button>

          {currentUserId === travel.userId && (
            <div className="owner-actions">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onEdit(travel)}
              >
                Редактировать
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDelete(travel.id)}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelCard;
