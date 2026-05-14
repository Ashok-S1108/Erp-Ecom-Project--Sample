import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  AttachMoney as SalesIcon,
  People as CustomersIcon,
  Warning as AlertsIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import './OverviewCards.css';

const OverviewCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;

  const cards = [
    {
      title: 'Total Sales',
      value: `$${stats?.totalSales?.toLocaleString() || '0'}`,
      change: stats?.salesChange || 0,
      icon: <SalesIcon fontSize="large" />,
      color: '#4caf50'
    },
    {
      title: 'New Orders',
      value: stats?.newOrders || 0,
      change: stats?.ordersChange || 0,
      icon: <OrdersIcon fontSize="large" />,
      color: '#2196f3'
    },
    {
      title: 'New Customers',
      value: stats?.newCustomers || 0,
      change: stats?.customersChange || 0,
      icon: <CustomersIcon fontSize="large" />,
      color: '#9c27b0'
    },
    {
      title: 'Inventory Alerts',
      value: stats?.lowStockItems || 0,
      icon: <AlertsIcon fontSize="large" />,
      color: '#ff9800'
    }
  ];

  return (
    <Grid container spacing={3} className="overview-cards">
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <CardContent>
              <div className="card-header">
                <Typography variant="h6" color="textSecondary">
                  {card.title}
                </Typography>
                <div className="card-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <Typography variant="h4" style={{ color: card.color }}>
                {card.value}
              </Typography>
              {card.change !== undefined && (
                <Typography 
                  variant="body2" 
                  className={`change ${card.change > 0 ? 'positive' : card.change < 0 ? 'negative' : ''}`}
                >
                  {card.change > 0 ? '↑' : card.change < 0 ? '↓' : ''} {Math.abs(card.change)}% from last period
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OverviewCards;