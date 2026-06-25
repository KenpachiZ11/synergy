import React, { useState, useEffect } from 'react';
import { rentalsAPI, purchasesAPI, booksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Calendar, ShoppingCart, Book } from 'lucide-react';

const UserProfile = () => {
  const { showError } = useNotifications();
  const [rentals, setRentals] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rentals');
  const { user } = useAuth();

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [rentalsRes, purchasesRes, booksRes] = await Promise.all([
        rentalsAPI.getByUserId(user.id),
        purchasesAPI.getByUserId(user.id),
        booksAPI.getAll()
      ]);
      
      setRentals(rentalsRes.data);
      setPurchases(purchasesRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      showError('Ошибка загрузки данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Неизвестная книга';
  };

  const getBookAuthor = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.author : 'Неизвестный автор';
  };

  const getDaysUntilExpiry = (endDate) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (endDate) => {
    const days = getDaysUntilExpiry(endDate);
    if (days < 0) return '#ef4444'; 
    if (days <= 3) return '#f59e0b';
    return '#059669';
  };

  const getStatusText = (endDate) => {
    const days = getDaysUntilExpiry(endDate);
    if (days < 0) return 'Просрочено';
    if (days === 0) return 'Истекает сегодня';
    if (days === 1) return 'Истекает завтра';
    if (days <= 3) return `Осталось ${days} дня`;
    return 'Активна';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="admin-panel">
        <h2>Мой профиль</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Добро пожаловать, {user?.name || user?.username}!
        </p>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'rentals' ? 'active' : ''}`}
            onClick={() => setActiveTab('rentals')}
          >
            <Calendar size={16} />
            Мои аренды ({rentals.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            <ShoppingCart size={16} />
            Мои покупки ({purchases.length})
          </button>
        </div>

        {activeTab === 'rentals' && (
          <div>
            <h3>Арендованные книги</h3>
            {rentals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>У вас пока нет арендованных книг</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Книга</th>
                      <th>Автор</th>
                      <th>Дата начала</th>
                      <th>Дата окончания</th>
                      <th>Срок</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map(rental => (
                      <tr key={rental.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Book size={16} />
                            {getBookTitle(rental.bookId)}
                          </div>
                        </td>
                        <td>{getBookAuthor(rental.bookId)}</td>
                        <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                        <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                        <td>
                          {rental.duration === 'twoWeeks' ? '2 недели' :
                           rental.duration === 'month' ? '1 месяц' : '3 месяца'}
                        </td>
                        <td>
                          <span style={{ 
                            color: getStatusColor(rental.endDate),
                            fontWeight: '500'
                          }}>
                            {getStatusText(rental.endDate)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <h3>Купленные книги</h3>
            {purchases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>У вас пока нет купленных книг</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Книга</th>
                      <th>Автор</th>
                      <th>Дата покупки</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map(purchase => (
                      <tr key={purchase.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Book size={16} />
                            {getBookTitle(purchase.bookId)}
                          </div>
                        </td>
                        <td>{getBookAuthor(purchase.bookId)}</td>
                        <td>{new Date(purchase.date).toLocaleDateString()}</td>
                        <td style={{ color: '#059669', fontWeight: '500' }}>
                          {purchase.price} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {purchases.length > 0 && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: '#f8fafc', 
                borderRadius: '0.5rem',
                textAlign: 'right'
              }}>
                <strong>
                  Общая сумма покупок: {purchases.reduce((sum, p) => sum + p.price, 0)} ₽
                </strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
