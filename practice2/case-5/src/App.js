
import React, { useState, useEffect } from 'react';
import './styles.css';

import { usersAPI, travelsAPI, likesAPI } from './api';

import Header from './components/Header';
import Navigation from './components/Navigation';
import TravelCard from './components/TravelCard';
import TravelForm from './components/TravelForm';
import UsersList from './components/UsersList';
import AuthForm from './components/AuthForm';

function App() {
  const [currentView, setCurrentView] = useState('travels');
  const [travels, setTravels] = useState([]);
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTravel, setEditingTravel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [travelsResponse, usersResponse, likesResponse] = await Promise.all([
        travelsAPI.getAll(),
        usersAPI.getAll(),
        likesAPI.getAll(),
      ]);
      
      setTravels(travelsResponse.data);
      setUsers(usersResponse.data);
      setLikes(likesResponse.data);
    } catch (err) {
      setError('Ошибка загрузки данных. Убедитесь, что JSON Server запущен.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('travels');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('travels');
    setTravels([]);
    setUsers([]);
    setLikes([]);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setEditingTravel(null);
    setError('');
    setSuccessMessage('');
  };

  const handleAddTravel = async (travelData) => {
    try {
      const response = await travelsAPI.create(travelData);
      setTravels([...travels, response.data]);
      setCurrentView('travels');
      setSuccessMessage('Путешествие успешно добавлено!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error('Ошибка при добавлении путешествия');
    }
  };

  const handleUpdateTravel = async (travelData) => {
    try {
      const response = await travelsAPI.update(editingTravel.id, travelData);
      setTravels(travels.map(t => t.id === editingTravel.id ? response.data : t));
      setEditingTravel(null);
      setCurrentView('travels');
      setSuccessMessage('Путешествие успешно обновлено!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw new Error('Ошибка при обновлении путешествия');
    }
  };

  const handleEditTravel = (travel) => {
    setEditingTravel(travel);
    setCurrentView('add-travel');
  };

  const handleDeleteTravel = async (travelId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это путешествие?')) {
      return;
    }

    try {
      await travelsAPI.delete(travelId);
      setTravels(travels.filter(t => t.id !== travelId));
      setSuccessMessage('Путешествие успешно удалено!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Ошибка при удалении путешествия');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLikeTravel = async (travelId) => {
    if (!currentUser) return;

    try {
      const existingLike = likes.find(
        like => like.userId === currentUser.id && like.travelId === travelId
      );

      if (existingLike) {
        await likesAPI.delete(existingLike.id);
        setLikes(likes.filter(like => like.id !== existingLike.id));
      } else {
        const newLike = {
          id: Date.now().toString(),
          userId: currentUser.id,
          travelId: travelId,
          createdAt: new Date().toISOString(),
        };
        const response = await likesAPI.create(newLike);
        setLikes([...likes, response.data]);
      }
    } catch (err) {
      setError('Ошибка при обработке лайка');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getLikesCount = (travelId) => {
    return likes.filter(like => like.travelId === travelId).length;
  };

  const isLikedByUser = (travelId) => {
    if (!currentUser) return false;
    return likes.some(like => like.userId === currentUser.id && like.travelId === travelId);
  };

  const handleCancelEdit = () => {
    setEditingTravel(null);
    setCurrentView('travels');
  };

  const getFilteredTravels = () => {
    if (currentView === 'my-travels') {
      return travels.filter(travel => travel.userId === currentUser?.id);
    }
    return travels;
  };

  const renderContent = () => {
    if (!currentUser) {
      return <AuthForm onLogin={handleLogin} />;
    }

    if (error && currentView !== 'add-travel') {
      return (
        <div className="error">
          {error}
          <button 
            onClick={loadData}
            className="btn btn-primary btn-sm"
            style={{ marginLeft: '1rem' }}
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'travels':
      case 'my-travels':
        const filteredTravels = getFilteredTravels();
        return (
          <div>
            <h2 style={{ marginBottom: '2rem' }}>
              {currentView === 'my-travels' ? 'Мои путешествия' : 'Все путешествия'}
            </h2>
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span style={{ marginLeft: '1rem' }}>Загрузка путешествий...</span>
              </div>
            ) : filteredTravels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <h3>
                  {currentView === 'my-travels' 
                    ? 'У вас пока нет путешествий' 
                    : 'Путешествий пока нет'
                  }
                </h3>
                <p>
                  {currentView === 'my-travels'
                    ? 'Добавьте свое первое путешествие!'
                    : 'Станьте первым, кто поделится своим путешествием!'
                  }
                </p>
                <button
                  onClick={() => setCurrentView('add-travel')}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Добавить путешествие
                </button>
              </div>
            ) : (
              <div className="grid grid-2">
                {filteredTravels.map((travel) => {
                  const user = users.find(u => u.id === travel.userId);
                  return (
                    <TravelCard
                      key={travel.id}
                      travel={travel}
                      user={user}
                      onEdit={handleEditTravel}
                      onDelete={handleDeleteTravel}
                      onLike={handleLikeTravel}
                      currentUserId={currentUser?.id}
                      likesCount={getLikesCount(travel.id)}
                      isLiked={isLikedByUser(travel.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'add-travel':
        return (
          <TravelForm
            travel={editingTravel}
            onSubmit={editingTravel ? handleUpdateTravel : handleAddTravel}
            onCancel={handleCancelEdit}
            currentUserId={currentUser?.id}
          />
        );

      case 'users':
        return (
          <UsersList
            users={users}
            travels={travels}
            loading={loading}
          />
        );

      default:
        return <div>Страница не найдена</div>;
    }
  };

  return (
    <div className="App">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      {currentUser && (
        <Navigation currentView={currentView} onViewChange={handleViewChange} />
      )}
      
      <main className="main">
        <div className="container">
          {successMessage && (
            <div className="success">
              {successMessage}
            </div>
          )}
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
