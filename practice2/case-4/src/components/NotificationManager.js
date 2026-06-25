import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationManager = ({ notifications, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} style={{ color: '#059669' }} />;
      case 'error':
        return <AlertCircle size={20} style={{ color: '#ef4444' }} />;
      case 'reminder':
        return <Bell size={20} style={{ color: '#f59e0b' }} />;
      default:
        return <Info size={20} style={{ color: '#3b82f6' }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)';
      case 'error':
        return 'linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%)';
      case 'reminder':
        return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
      default:
        return 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'reminder':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div
      style={{
        background: getBackgroundColor(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: isLeaving 
          ? 'translateX(100%)' 
          : isVisible 
            ? 'translateX(0)' 
            : 'translateX(100%)',
        opacity: isLeaving ? 0 : isVisible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '100%',
        minWidth: '300px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        {getIcon()}
        
        <div style={{ flex: 1 }}>
          {notification.title && (
            <div style={{
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '4px',
              color: '#1f2937'
            }}>
              {notification.title}
            </div>
          )}
          <div style={{
            fontSize: '13px',
            color: '#4b5563',
            lineHeight: '1.4'
          }}>
            {notification.message}
          </div>
          {notification.details && (
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              {notification.details}
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            color: '#6b7280',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
            e.target.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationManager;
