import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Header from './components/Header';
import Login from './components/Login';
import BookCatalog from './components/BookCatalog';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import NotificationManager from './components/NotificationManager';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const { notifications, removeNotification } = useNotifications();
  const [currentView, setCurrentView] = useState('books');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'books':
        return <BookCatalog />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <BookCatalog />;
      case 'profile':
        return user?.role === 'user' ? <UserProfile /> : <BookCatalog />;
      default:
        return <BookCatalog />;
    }
  };

  return (
    <div className="App">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      {renderContent()}
      <NotificationManager 
        notifications={notifications} 
        onDismiss={removeNotification} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
