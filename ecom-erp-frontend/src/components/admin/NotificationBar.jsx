// components/admin/NotificationBar.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle,FiShoppingCart, FiPackage} from 'react-icons/fi';
import './NotificationBar.css';

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      // In a real app, you would fetch from your API
      const mockNotifications = [
        {
          id: 1,
          type: 'order',
          message: 'New order #1234 received',
          time: '5 minutes ago',
          read: false
        },
        {
          id: 2,
          type: 'inventory',
          message: 'Low stock for Product XYZ',
          time: '2 hours ago',
          read: false
        },
        {
          id: 3,
          type: 'system',
          message: 'System update available',
          time: '1 day ago',
          read: true
        }
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`notification-bar ${isOpen ? 'open' : ''}`}>
      <div className="notification-header">
        <h3>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
        <div className="notification-actions">
          <button onClick={markAllAsRead}>Mark all as read</button>
          <button onClick={() => setIsOpen(!isOpen)} className="close-btn">
            <FiX />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : ''}`}
            >
              <div className="notification-icon">
                {notification.type === 'order' && <FiShoppingCart />}
                {notification.type === 'inventory' && <FiPackage />}
                {notification.type === 'system' && <FiAlertCircle />}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">{notification.time}</p>
              </div>
              {!notification.read && (
                <button 
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  <FiCheck />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationBar;