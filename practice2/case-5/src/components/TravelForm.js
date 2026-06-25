import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from './ImageUpload';

const TravelForm = ({ travel, onSubmit, onCancel, currentUserId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      name: '',
    },
    images: [],
    cost: '',
    currency: 'RUB',
    startDate: '',
    endDate: '',
    culturalSites: [''],
    placesToVisit: [''],
    ratings: {
      transportation: 5,
      safety: 5,
      population: 5,
      nature: 5,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (travel) {
      setFormData({
        ...travel,
        images: travel.images || [],
        culturalSites: travel.culturalSites?.length ? travel.culturalSites : [''],
        placesToVisit: travel.placesToVisit?.length ? travel.placesToVisit : [''],
      });
    }
  }, [travel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (name.includes('ratings.')) {
      const ratingKey = name.replace('ratings.', '');
      setFormData(prev => ({
        ...prev,
        ratings: {
          ...prev.ratings,
          [ratingKey]: parseInt(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
         

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item),
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ''],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Валидация
      if (!formData.title.trim()) {
        throw new Error('Название путешествия обязательно');
      }
      if (!formData.location.name.trim()) {
        throw new Error('Местоположение обязательно');
      }
      if (!formData.startDate || !formData.endDate) {
        throw new Error('Даты начала и окончания обязательны');
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error('Дата начала не может быть позже даты окончания');
      }

      // Очистка данных
      const cleanedData = {
        ...formData,
        cost: parseFloat(formData.cost) || 0,
        culturalSites: formData.culturalSites.filter(site => site.trim()),
        placesToVisit: formData.placesToVisit.filter(place => place.trim()),
        location: {
          name: formData.location.name,
        },
      };

      if (!travel) {
        cleanedData.id = uuidv4();
        cleanedData.userId = currentUserId || '1'; // Текущий пользователь
        cleanedData.createdAt = new Date().toISOString();
      }
      cleanedData.updatedAt = new Date().toISOString();

      await onSubmit(cleanedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{travel ? 'Редактировать путешествие' : 'Добавить новое путешествие'}</h2>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Название путешествия *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Местоположение *</label>
        <input
          type="text"
          name="location.name"
          value={formData.location.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Например: Санкт-Петербург, Россия"
          required
        />
      </div>

      <ImageUpload
        images={formData.images}
        onChange={(images) => setFormData(prev => ({ ...prev, images }))}
        maxImages={5}
      />

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Дата начала *</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Дата окончания *</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Стоимость</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="form-input"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Валюта</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="form-select"
          >
            <option value="RUB">RUB (Рубли)</option>
            <option value="USD">USD (Доллары)</option>
            <option value="EUR">EUR (Евро)</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Культурные места</label>
        {formData.culturalSites.map((site, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={site}
              onChange={(e) => handleArrayChange('culturalSites', index, e.target.value)}
              className="form-input"
              placeholder="Название культурного места"
            />
            {formData.culturalSites.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('culturalSites', index)}
                className="btn btn-secondary btn-sm"
              >
                Удалить
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('culturalSites')}
          className="btn btn-outline btn-sm"
        >
          Добавить место
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Места для посещения</label>
        {formData.placesToVisit.map((place, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={place}
              onChange={(e) => handleArrayChange('placesToVisit', index, e.target.value)}
              className="form-input"
              placeholder="Место для посещения"
            />
            {formData.placesToVisit.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('placesToVisit', index)}
                className="btn btn-secondary btn-sm"
              >
                Удалить
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('placesToVisit')}
          className="btn btn-outline btn-sm"
        >
          Добавить место
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Оценки (от 1 до 5)</label>
        <div className="grid grid-2">
          {Object.entries(formData.ratings).map(([key, value]) => (
            <div key={key} className="form-group">
              <label className="form-label">
                {key === 'transportation' && 'Транспорт'}
                {key === 'safety' && 'Безопасность'}
                {key === 'population' && 'Населенность'}
                {key === 'nature' && 'Природа'}
              </label>
              <select
                name={`ratings.${key}`}
                value={value}
                onChange={handleChange}
                className="form-select"
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : (travel ? 'Обновить' : 'Добавить')}
        </button>
      </div>
    </form>
  );
};

export default TravelForm;
