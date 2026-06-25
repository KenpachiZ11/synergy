import React, { useState, useEffect } from 'react';
import { booksAPI, rentalsAPI, purchasesAPI, usersAPI } from '../services/api';
import { Plus, Edit, Trash2, Bell, BookOpen, Users, ShoppingCart } from 'lucide-react';
import BookModal from './BookModal';
import { useNotifications } from '../context/NotificationContext';

const AdminPanel = () => {
  const { showSuccess, showError, showReminder, showInfo } = useNotifications();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [expiringRentals, setExpiringRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, usersRes, rentalsRes, purchasesRes, expiringRes] = await Promise.all([
        booksAPI.getAll(),
        usersAPI.getAll(),
        rentalsAPI.getAll(),
        purchasesAPI.getAll(),
        rentalsAPI.getExpiring()
      ]);

      setBooks(booksRes.data);
      setUsers(usersRes.data);
      setRentals(rentalsRes.data);
      setPurchases(purchasesRes.data);
      setExpiringRentals(expiringRes.data);
    } catch (err) {
      showError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowBookModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookModal(true);
  };

  const handleSaveBook = async (bookData) => {
    try {
      const updatedBookData = {
        ...bookData,
        inStock: Number(bookData.inStock),
        available: Number(bookData.inStock) > 0 && bookData.status === 'available',
        status: Number(bookData.inStock) <= 0 ? 'out_of_stock' : bookData.status
      };

      if (editingBook) {
        await booksAPI.update(editingBook.id, updatedBookData);
        showSuccess('Книга успешно обновлена!');
      } else {
        await booksAPI.create({ ...updatedBookData, id: Date.now().toString() });
        showSuccess('Книга успешно добавлена!');
      }
      setShowBookModal(false);
      setEditingBook(null);
      loadData();
    } catch (err) {
      showError('Ошибка при сохранении книги');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту книгу?')) return;
    
    try {
      await booksAPI.delete(bookId);
      showSuccess('Книга успешно удалена!');
      loadData();
    } catch (err) {
      showError('Ошибка при удалении книги');
    }
  };

  const testReminders = () => {
    showInfo('Запуск проверки напоминаний...');
    const today = new Date();
    
    const expiringRentals = rentals.filter(rental => {
      const endDate = new Date(rental.endDate);
      const timeDiff = endDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return rental.status === 'active' && daysDiff <= 3 && daysDiff >= 0 && !rental.reminderSent;
    });

    showInfo(`Найдено ${expiringRentals.length} аренд для напоминания`, {
      details: 'Детали в консоли браузера'
    });

    console.log('=== ТЕСТ НАПОМИНАНИЙ ===');
    console.log('Сегодняшняя дата:', today.toISOString().split('T')[0]);
    expiringRentals.forEach(rental => {
      const user = users.find(u => u.id == rental.userId);
      const book = books.find(b => b.id == rental.bookId);
      console.log(`Напоминание: ${user?.name} - "${book?.title}" (до ${rental.endDate})`);
    });
  };

  const sendAllReminders = async () => {
    try {
      const today = new Date();
      const expiringRentals = rentals.filter(rental => {
        const endDate = new Date(rental.endDate);
        const timeDiff = endDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return rental.status === 'active' && daysDiff <= 3 && daysDiff >= 0 && !rental.reminderSent;
      });

      if (expiringRentals.length === 0) {
        showInfo('Нет аренд, требующих напоминания');
        return;
      }

      for (const rental of expiringRentals) {
        await rentalsAPI.update(rental.id, { ...rental, reminderSent: true });
        const user = users.find(u => u.id == rental.userId);
        const book = books.find(b => b.id == rental.bookId);
        
        showReminder(`Напоминание отправлено: ${user?.name}`, {
          details: `Книга "${book?.title}" • До ${new Date(rental.endDate).toLocaleDateString()}`
        });
      }

      showSuccess(`Отправлено ${expiringRentals.length} напоминаний!`);
      loadData();
    } catch (err) {
      showError('Ошибка при отправке напоминаний');
    }
  };

  const sendReminder = async (rentalId) => {
    try {
      const rental = rentals.find(r => r.id === rentalId);
      if (!rental) return;

      await rentalsAPI.update(rentalId, { ...rental, reminderSent: true });
      
      const user = users.find(u => u.id == rental.userId);
      const book = books.find(b => b.id == rental.bookId);
      
      showReminder(`Напоминание отправлено: ${getUserName(rental.userId)}`, {
        details: `Книга "${getBookTitle(rental.bookId)}" • До ${new Date(rental.endDate).toLocaleDateString()}`
      });
      
      loadData();
    } catch (err) {
      showError('Ошибка при отправке напоминания');
    }
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Неизвестная книга';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name || user.username : 'Неизвестный пользователь';
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
        <h2>Панель администратора</h2>
        
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <BookOpen size={16} />
            Управление книгами
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            Пользователи
          </button>
          <button
            className={`admin-tab ${activeTab === 'rentals' ? 'active' : ''}`}
            onClick={() => setActiveTab('rentals')}
          >
            <Bell size={16} />
            Аренда
          </button>
          <button
            className={`admin-tab ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            <ShoppingCart size={16} />
            Покупки
          </button>
        </div>

        {activeTab === 'books' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3>Управление книгами</h3>
              <button onClick={handleAddBook} className="btn btn-primary">
                <Plus size={16} />
                Добавить книгу
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Автор</th>
                    <th>Категория</th>
                    <th>Год</th>
                    <th>Цена</th>
                    <th>В наличии</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.year}</td>
                      <td>{book.price} ₽</td>
                      <td>{book.inStock}</td>
                      <td>
                        <span className={`status-${book.status.replace('_', '-')}`}>
                          {book.status === 'available' ? 'Доступна' : 
                           book.status === 'out_of_stock' ? 'Нет в наличии' : 'Снята с продажи'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditBook(book)}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="btn btn-danger"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3>Пользователи системы</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={user.role === 'admin' ? 'status-admin' : 'status-user'}>
                          {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rentals' && (
          <div>
            <h3>Управление арендой</h3>
            
            <div style={{ 
              background: '#f8fafc', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <h4 style={{ margin: 0, color: '#374151' }}>Тестирование напоминаний:</h4>
              <button
                onClick={testReminders}
                className="btn btn-secondary"
                style={{ fontSize: '0.9rem' }}
              >
                Проверить напоминания
              </button>
              <button
                onClick={sendAllReminders}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem' }}
              >
                Отправить все напоминания
              </button>
            </div>
            
            {expiringRentals.length > 0 && (
              <div style={{ background: '#fef3cd', border: '1px solid #fecaca', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                <h4 style={{ color: '#92400e', marginBottom: '1rem' }}>
                  <Bell size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Аренда заканчивается в ближайшее время:
                </h4>
                {expiringRentals.map(rental => (
                  <div key={rental.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span>
                      {getUserName(rental.userId)} - "{getBookTitle(rental.bookId)}" 
                      (до {new Date(rental.endDate).toLocaleDateString()})
                    </span>
                    {!rental.reminderSent && (
                      <button
                        onClick={() => sendReminder(rental.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                      >
                        Отправить напоминание
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Книга</th>
                    <th>Начало аренды</th>
                    <th>Конец аренды</th>
                    <th>Срок</th>
                    <th>Статус</th>
                    <th>Напоминание</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map(rental => (
                    <tr key={rental.id}>
                      <td>{getUserName(rental.userId)}</td>
                      <td>{getBookTitle(rental.bookId)}</td>
                      <td>{new Date(rental.startDate).toLocaleDateString()}</td>
                      <td>{new Date(rental.endDate).toLocaleDateString()}</td>
                      <td>
                        {rental.duration === 'twoWeeks' ? '2 недели' :
                         rental.duration === 'month' ? '1 месяц' : '3 месяца'}
                      </td>
                      <td>
                        <span className={`status-${rental.status}`}>
                          {rental.status === 'active' ? 'Активна' : 'Завершена'}
                        </span>
                      </td>
                      <td>
                        {rental.reminderSent ? 
                          <span style={{ color: '#059669' }}>Отправлено</span> : 
                          <span style={{ color: '#6b7280' }}>Не отправлено</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <h3>История покупок</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Книга</th>
                    <th>Дата покупки</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(purchase => (
                    <tr key={purchase.id}>
                      <td>{getUserName(purchase.userId)}</td>
                      <td>{getBookTitle(purchase.bookId)}</td>
                      <td>{new Date(purchase.date).toLocaleDateString()}</td>
                      <td>{purchase.price} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showBookModal && (
        <BookModal
          book={editingBook}
          onSave={handleSaveBook}
          onCancel={() => {
            setShowBookModal(false);
            setEditingBook(null);
          }}
          isEdit={!!editingBook}
        />
      )}
    </div>
  );
};

export default AdminPanel;
