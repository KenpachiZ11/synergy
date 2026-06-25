import React, { useState, useEffect } from 'react';
import { booksAPI, rentalsAPI, purchasesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ShoppingCart, Calendar, Filter } from 'lucide-react';
import RentalModal from './RentalModal';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    year: '',
    sortBy: 'title'
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [books, filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      showError('Ошибка загрузки книг');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    if (filters.category) {
      filtered = filtered.filter(book => book.category === filters.category);
    }
    if (filters.author) {
      filtered = filtered.filter(book => 
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    if (filters.year) {
      filtered = filtered.filter(book => book.year.toString() === filters.year);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.year - a.year;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePurchase = async (bookId) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book || book.inStock <= 0) {
        showError('Книга недоступна для покупки');
        return;
      }

      await purchasesAPI.create({
        userId: user.id,
        bookId: bookId,
        date: new Date().toISOString().split('T')[0],
        price: book.price
      });

      const newStock = Number(book.inStock) - 1;
      const updatedBook = {
        ...book,
        inStock: newStock,
        available: newStock > 0,
        status: newStock > 0 ? 'available' : 'out_of_stock'
      };

      await booksAPI.update(bookId, updatedBook);
      
      showSuccess(`Книга "${book.title}" успешно куплена!`, {
        details: `Цена: ${book.price} ₽`
      });
      
      loadBooks();
    } catch (err) {
      showError('Ошибка при покупке книги');
    }
  };

  const handleRent = (book) => {
    setSelectedBook(book);
    setShowRentalModal(true);
  };

  const handleRentalComplete = async (rentalData) => {
    try {
      const book = books.find(b => b.id === selectedBook.id);
      if (!book || book.inStock <= 0) {
        showError('Книга недоступна для аренды');
        setShowRentalModal(false);
        setSelectedBook(null);
        return;
      }

      await rentalsAPI.create({
        userId: user.id,
        bookId: selectedBook.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: rentalData.endDate,
        duration: rentalData.duration,
        status: 'active',
        reminderSent: false
      });

      const newStock = Number(book.inStock) - 1;
      const updatedBook = {
        ...book,
        inStock: newStock,
        available: newStock > 0,
        status: newStock > 0 ? 'available' : 'out_of_stock'
      };

      await booksAPI.update(selectedBook.id, updatedBook);
      
      showSuccess(`Книга "${selectedBook.title}" взята в аренду!`, {
        details: `До ${new Date(rentalData.endDate).toLocaleDateString()} • Стоимость: ${rentalData.price} ₽`
      });
      
      setShowRentalModal(false);
      setSelectedBook(null);
      
      loadBooks();
    } catch (err) {
      showError('Ошибка при аренде книги');
    }
  };

  const getUniqueValues = (key) => {
    return [...new Set(books.map(book => book[key]))].sort();
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
      <div className="filters">
        <h3>
          <Filter size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Фильтры и сортировка
        </h3>
        <div className="filter-grid">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">Все категории</option>
            {getUniqueValues('category').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Поиск по автору"
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            className="filter-select"
          />

          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="filter-select"
          >
            <option value="">Все годы</option>
            {getUniqueValues('year').map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="title">Сортировать по названию</option>
            <option value="author">Сортировать по автору</option>
            <option value="year">Сортировать по году</option>
            <option value="price">Сортировать по цене</option>
          </select>
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <img 
              src={book.cover} 
              alt={book.title}
              className="book-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop';
              }}
            />
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <span className="book-category">{book.category}</span>
              <p className="book-year">Год издания: {book.year}</p>
              <p className="book-description">{book.description}</p>
              
              <div className="book-price">
                Цена: {book.price} ₽ | Аренда: {book.rentalPrice} ₽/мес
              </div>
              
              <div className="book-status">
                {book.available && Number(book.inStock) > 0 ? (
                  <span className="status-available">
                    В наличии ({book.inStock} шт.)
                  </span>
                ) : (
                  <span className="status-out-of-stock">
                    {book.status === 'discontinued' ? 'Снята с продажи' : 'Нет в наличии'}
                  </span>
                )}
              </div>

              {user?.role === 'user' && book.available && Number(book.inStock) > 0 && (
                <div className="book-actions">
                  <button
                    onClick={() => handlePurchase(book.id)}
                    className="btn btn-buy"
                    disabled={!book.available || Number(book.inStock) <= 0}
                  >
                    <ShoppingCart size={16} />
                    Купить
                  </button>
                  <button
                    onClick={() => handleRent(book)}
                    className="btn btn-rent"
                    disabled={!book.available || Number(book.inStock) <= 0}
                  >
                    <Calendar size={16} />
                    Арендовать
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Книги не найдены
        </div>
      )}

      {selectedBook && showRentalModal && (
        <RentalModal
          book={selectedBook}
          onConfirm={handleRentalComplete}
          onCancel={() => {
            setShowRentalModal(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BookCatalog;
