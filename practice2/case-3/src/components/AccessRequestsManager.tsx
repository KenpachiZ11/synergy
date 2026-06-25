import React from 'react';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';

const AccessRequestsManager: React.FC = () => {
  const { getUserAccessRequests, approveAccessRequest, rejectAccessRequest, posts } = useBlog();
  const { users } = useAuth();

  const accessRequests = getUserAccessRequests();

  const getPostTitle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post ? post.title : 'Пост не найден';
  };

  const getRequesterName = (requesterId: string) => {
    const user = users.find(u => u.id === requesterId);
    return user ? user.username : 'Пользователь не найден';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'approved':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'approved':
        return 'Одобрен';
      case 'rejected':
        return 'Отклонен';
      default:
        return status;
    }
  };

  if (accessRequests.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E5E7EB'
      }}>
        <h3 style={{ color: '#6B7280', margin: 0 }}>
          Нет запросов на доступ
        </h3>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        color: '#1F2937',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '2rem'
      }}>
        Запросы на доступ к постам
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {accessRequests.map((request) => (
          <div
            key={request.id}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#1F2937',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  {getPostTitle(request.postId)}
                </h4>
                <p style={{
                  margin: '0 0 0.5rem 0',
                  color: '#6B7280',
                  fontSize: '0.875rem'
                }}>
                  Запрос от: <strong>{getRequesterName(request.requesterId)}</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: '#6B7280',
                  fontSize: '0.875rem'
                }}>
                  Дата: {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{
                  backgroundColor: getStatusColor(request.status),
                  color: 'white',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {getStatusText(request.status)}
                </span>

                {request.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => approveAccessRequest(request.id)}
                      style={{
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#10B981';
                      }}
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => rejectAccessRequest(request.id)}
                      style={{
                        backgroundColor: '#EF4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#EF4444';
                      }}
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessRequestsManager;
