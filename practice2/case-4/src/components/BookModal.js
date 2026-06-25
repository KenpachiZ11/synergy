import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const BookModal = ({ book, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    year: new Date().getFullYear(),
    price: 0,
    rentalPrice: 0,
    description: '',
    cover: '',
    inStock: 1,
    available: true,
    status: 'available'
  });

  useEffect(() => {
    if (book) {
      setFormData(book);
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    if (name === 'year' || name === 'price' || name === 'rentalPrice' || name === 'inStock') {
      newValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>{isEdit ? 'Редактировать книгу' : 'Добавить новую книгу'}</h3>
          <button onClick={onCancel} className="btn btn-secondary" style={{ padding: '0.25rem' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название:</label>
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
            <label>Автор:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Категория:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Выберите категорию</option>
              <option value="Классическая литература">Классическая литература</option>
              <option value="Современная литература">Современная литература</option>
              <option value="Научная фантастика">Научная фантастика</option>
              <option value="Фэнтези">Фэнтези</option>
              <option value="Магический реализм">Магический реализм</option>
              <option value="Детектив">Детектив</option>
              <option value="Роман">Роман</option>
              <option value="Поэзия">Поэзия</option>
            </select>
          </div>

          <div className="form-group">
            <label>Год издания:</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="form-input"
              min="1800"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Цена покупки (₽):</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Цена аренды (₽/мес):</label>
              <input
                type="number"
                name="rentalPrice"
                value={formData.rentalPrice}
                onChange={handleChange}
                className="form-input"
                min="0"
                step="10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>URL обложки:</label>
            <input
              type="url"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Количество в наличии:</label>
              <input
                type="number"
                name="inStock"
                value={formData.inStock}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Статус:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="available">Доступна</option>
                <option value="out_of_stock">Нет в наличии</option>
                <option value="discontinued">Снята с продажи</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              Доступна для заказа
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
