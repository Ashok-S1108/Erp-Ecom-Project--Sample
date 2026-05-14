import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography,
  Divider,
  Chip,
  Badge
} from '@mui/material';
import { 
  ShoppingCart as OrderIcon,
  Payment as PaymentIcon,
  PersonAdd as UserIcon,
  Inventory as StockIcon,
  Error as AlertIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/admin/activities');
        setActivities(response.data);
        setUnreadCount(response.data.filter(a => !a.read).length);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();

    // Set up real-time updates (WebSocket or polling)
    const activityUpdateInterval = setInterval(fetchActivities, 30000);
    return () => clearInterval(activityUpdateInterval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <OrderIcon />;
      case 'payment': return <PaymentIcon />;
      case 'user': return <UserIcon />;
      case 'inventory': return <StockIcon />;
      case 'alert': return <AlertIcon color="error" />;
      default: return <OrderIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'order': return '#2196f3';
      case 'payment': return '#4caf50';
      case 'user': return '#9c27b0';
      case 'inventory': return '#ff9800';
      case 'alert': return '#f44336';
      default: return '#607d8b';
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/admin/activities/${id}/read`);
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, read: true } : activity
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking activity as read:', error);
    }
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <Typography variant="h6">Recent Activity</Typography>
        {unreadCount > 0 && (
          <Chip 
            label={`${unreadCount} New`}
            color="primary"
            size="small"
          />
        )}
      </div>
      
      {loading ? (
        <Typography>Loading activities...</Typography>
      ) : activities.length === 0 ? (
        <Typography>No recent activities</Typography>
      ) : (
        <List className="activity-list">
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem 
                alignItems="flex-start"
                className={`activity-item ${!activity.read ? 'unread' : ''}`}
                onClick={() => markAsRead(activity.id)}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={activity.read}
                  >
                    <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {activity.description}
                      </Typography>
                      <br />
                      {new Date(activity.timestamp).toLocaleString()}
                    </>
                  }
                />
                {activity.important && !activity.read && (
                  <Chip label="Important" color="error" size="small" />
                )}
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
};

export default ActivityFeed;