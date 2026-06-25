import React, { useState } from 'react';
import { Post, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';

interface PostCardProps {
  post: Post;
  author: User | undefined;
  onEdit?: () => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, author, onEdit, showActions = true }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();
  const { deletePost, addComment, requestAccess, users, hasAccessToPost } = useBlog();

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        await deletePost(post.id);
      } catch (error) {
        console.error('Ошибка при удалении поста:', error);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await addComment(post.id, newComment);
        setNewComment('');
      } catch (error) {
        console.error('Ошибка при добавлении комментария:', error);
      }
    }
  };

  const handleRequestAccess = () => {
    requestAccess(post.id);
    alert('Запрос на доступ отправлен автору поста');
  };

  const canViewPost = hasAccessToPost(post.id);
  const isAuthor = currentUser?.id === post.authorId;

  if (post.isRequestOnly && !canViewPost) {
    return (
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        backgroundColor: '#F9FAFB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease'
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#1F2937',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          {post.title}
        </h3>
        <p style={{ 
          color: '#6B7280',
          margin: '0 0 1rem 0',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}>
          Этот пост доступен только по запросу автора.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={handleRequestAccess}
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(6, 182, 212, 0.25)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(6, 182, 212, 0.25)';
            }}
          >
            Запросить доступ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 0.75rem 0',
            color: '#1F2937',
            fontSize: '1.375rem',
            fontWeight: '700',
            lineHeight: '1.3'
          }}>
            {post.title}
          </h3>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}>
                {(author?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ 
                color: '#374151', 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {author?.username || 'Неизвестный'}
              </span>
            </div>
            <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>•</span>
            <span style={{ 
              color: '#6B7280', 
              fontSize: '0.875rem' 
            }}>
              {post.createdAt.toLocaleDateString('ru-RU')}
            </span>
            {post.isPrivate && (
              <>
                <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>•</span>
                <span style={{ 
                  color: '#EF4444',
                  fontSize: '0.75rem',
                  backgroundColor: '#FEF2F2',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  🔒 Приватный
                </span>
              </>
            )}
            {post.isRequestOnly && (
              <>
                <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>•</span>
                <span style={{ 
                  color: '#F59E0B',
                  fontSize: '0.75rem',
                  backgroundColor: '#FFFBEB',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  По запросу
                </span>
              </>
            )}
          </div>
        </div>
        
        {showActions && isAuthor && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onEdit}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.25)';
              }}
            >
              Редактировать
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.25)';
              }}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ 
          whiteSpace: 'pre-wrap',
          color: '#374151',
          fontSize: '1rem',
          lineHeight: '1.6',
          margin: 0
        }}>
          {post.content}
        </p>
      </div>
      
      {post.tags.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  color: '#5B21B6',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  border: '1px solid #C4B5FD'
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ 
        borderTop: '1px solid #E5E7EB', 
        paddingTop: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: showComments 
              ? 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
              : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            boxShadow: showComments 
              ? '0 2px 8px rgba(107, 114, 128, 0.25)'
              : '0 2px 8px rgba(79, 70, 229, 0.25)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = showComments 
              ? '0 4px 12px rgba(107, 114, 128, 0.35)'
              : '0 4px 12px rgba(79, 70, 229, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = showComments 
              ? '0 2px 8px rgba(107, 114, 128, 0.25)'
              : '0 2px 8px rgba(79, 70, 229, 0.25)';
          }}
        >
          {showComments ? 'Скрыть' : 'Показать'} комментарии ({post.comments.length})
        </button>
        
        {showComments && (
          <div style={{ marginTop: '1.5rem' }}>
            {currentUser && (
              <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Написать комментарий..."
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      backgroundColor: '#F9FAFB',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4F46E5';
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.backgroundColor = '#F9FAFB';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.35)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.25)';
                    }}
                  >
                    Отправить
                  </button>
                </div>
              </form>
            )}
            
            {post.comments.map((comment) => {
              const commentAuthor = users.find((u: User) => u.id === comment.authorId);
              
              return (
                <div
                  key={comment.id}
                  style={{
                    backgroundColor: '#F9FAFB',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    marginBottom: '0.75rem',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.625rem'
                    }}>
                      {(commentAuthor?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6B7280',
                      fontWeight: '500'
                    }}>
                      {commentAuthor?.username || 'Неизвестный'}
                    </span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>•</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#9CA3AF'
                    }}>
                      {comment.createdAt.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}>
                    {comment.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
