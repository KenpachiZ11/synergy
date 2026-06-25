import React, { useState } from 'react';
import { X } from 'lucide-react';

const RentalModal = ({ book, onConfirm, onCancel }) => {
  const [duration, setDuration] = useState('month');

  const getDurationInfo = () => {
    const today = new Date();
    let endDate;
    let price = book.rentalPrice;

    switch (duration) {
      case 'twoWeeks':
        endDate = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
        price = Math.round(book.rentalPrice * 0.5);
        break;
      case 'month':
        endDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        price = book.rentalPrice;
        break;
      case 'threeMonths':
        endDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
        price = Math.round(book.rentalPrice * 2.5);
        break;
      default:
        endDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    }

    return {
      endDate: endDate.toISOString().split('T')[0],
      price,
      endDateFormatted: endDate.toLocaleDateString()
    };
  };

  const handleConfirm = () => {
    const info = getDurationInfo();
    onConfirm({
      duration,
      endDate: info.endDate,
      price: info.price
    });
  };

  const info = getDurationInfo();

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Аренда книги</h3>
          <button onClick={onCancel} className="btn btn-secondary" style={{ padding: '0.25rem' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4>{book.title}</h4>
          <p style={{ color: '#6b7280' }}>{book.author}</p>
        </div>

        <div className="form-group">
          <label>Срок аренды:</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="form-input"
          >
            <option value="twoWeeks">2 недели</option>
            <option value="month">1 месяц</option>
            <option value="threeMonths">3 месяца</option>
          </select>
        </div>

        <div style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <p><strong>Период аренды:</strong> до {info.endDateFormatted}</p>
          <p><strong>Стоимость:</strong> {info.price} ₽</p>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
          <button onClick={handleConfirm} className="btn btn-primary">
            Арендовать
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;
