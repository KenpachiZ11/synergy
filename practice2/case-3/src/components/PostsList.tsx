import React, { useState } from 'react';
import { Post, SortBy } from '../types';
import { useSortedPosts } from '../hooks/useSortedPosts';
import PostCard from './PostCard';
import { useAuth } from '../contexts/AuthContext';

interface PostsListProps {
  posts: Post[];
  title: string;
  onEditPost?: (post: Post) => void;
  showActions?: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ posts, title, onEditPost, showActions = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const { sortedPosts, sortBy, sortOrder, handleSort } = useSortedPosts(posts);
  const { users } = useAuth();

  const filteredPosts = sortedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const getSortIcon = (sortType: SortBy) => {
    if (sortBy !== sortType) return '';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: 0,
          color: '#1F2937',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          {title}
        </h2>
        {posts.length > 0 && (
          <span style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '0.375rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {posts.length}
          </span>
        )}
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Поиск по заголовку или содержанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid #D1D5DB',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
        </div>
        
        <div style={{ minWidth: '160px' }}>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '0.875rem',
              border: '1px solid #D1D5DB',
              borderRadius: '12px',
              backgroundColor: '#F9FAFB',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="">Все теги</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSort('date')}
            style={{
              padding: '0.75rem 1rem',
              border: sortBy === 'date' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '12px',
              background: sortBy === 'date' 
                ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                : 'white',
              color: sortBy === 'date' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: sortBy === 'date' 
                ? '0 2px 8px rgba(79, 70, 229, 0.25)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            Дата {getSortIcon('date')}
          </button>
          
          <button
            onClick={() => handleSort('title')}
            style={{
              padding: '0.75rem 1rem',
              border: sortBy === 'title' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '12px',
              background: sortBy === 'title' 
                ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                : 'white',
              color: sortBy === 'title' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: sortBy === 'title' 
                ? '0 2px 8px rgba(79, 70, 229, 0.25)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            Заголовок {getSortIcon('title')}
          </button>
          
          <button
            onClick={() => handleSort('tags')}
            style={{
              padding: '0.75rem 1rem',
              border: sortBy === 'tags' ? 'none' : '1px solid #E5E7EB',
              borderRadius: '12px',
              background: sortBy === 'tags' 
                ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                : 'white',
              color: sortBy === 'tags' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: sortBy === 'tags' 
                ? '0 2px 8px rgba(79, 70, 229, 0.25)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            Теги {getSortIcon('tags')}
          </button>
        </div>
      </div>

      {filteredPosts.length > 0 && (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: '12px'
        }}>
          <span style={{ 
            color: '#0369A1', 
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Показано {filteredPosts.length} из {posts.length} постов
          </span>
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <p>Нет постов для отображения</p>
      ) : (
        filteredPosts.map(post => {
          const author = users.find(user => user.id === post.authorId);
          return (
            <PostCard
              key={post.id}
              post={post}
              author={author}
              onEdit={onEditPost ? () => onEditPost(post) : undefined}
              showActions={showActions}
            />
          );
        })
      )}
    </div>
  );
};

export default PostsList;
