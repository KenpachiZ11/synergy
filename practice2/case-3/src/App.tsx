import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { useAuth } from './contexts/AuthContext';
import { useBlog } from './contexts/BlogContext';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import PostForm from './components/PostForm';
import PostsList from './components/PostsList';
import UsersList from './components/UsersList';
import AccessRequestsManager from './components/AccessRequestsManager';
import { Post } from './types';

const AppContent: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [currentView, setCurrentView] = useState('public');
  
  const { currentUser } = useAuth();
  const { getPublicPosts, getSubscriptionPosts, getPostsByUser, getRequestOnlyPosts } = useBlog();

  const handleShowPostForm = (post?: Post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setEditingPost(undefined);
  };

  const getPosts = () => {
    switch (currentView) {
      case 'public':
        return getPublicPosts();
      case 'subscription':
        return getSubscriptionPosts();
      case 'my':
        return currentUser ? getPostsByUser(currentUser.id) : [];
      case 'request-only':
        return getRequestOnlyPosts();
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'public':
        return 'Публичные посты';
      case 'subscription':
        return 'Посты из подписок';
      case 'my':
        return 'Мои посты';
      case 'request-only':
        return 'Посты по запросу';
      case 'access-requests':
        return 'Управление запросами';
      default:
        return 'Посты';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F9FAFB',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <Header
        onShowAuth={() => setShowAuthForm(true)}
        onShowPostForm={() => handleShowPostForm()}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem 2rem 1rem'
      }}>
        {currentView === 'users' ? (
          <UsersList />
        ) : currentView === 'access-requests' ? (
          <AccessRequestsManager />
        ) : (
          <PostsList
            posts={getPosts()}
            title={getTitle()}
            onEditPost={handleShowPostForm}
            showActions={currentView === 'my'}
          />
        )}
      </main>
      
      {showAuthForm && (
        <AuthForm onClose={() => setShowAuthForm(false)} />
      )}
      
      {showPostForm && (
        <PostForm
          post={editingPost}
          onClose={handleClosePostForm}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <AppContent />
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
