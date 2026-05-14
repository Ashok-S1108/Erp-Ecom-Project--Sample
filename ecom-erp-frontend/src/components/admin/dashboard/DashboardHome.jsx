// components/admin/dashboard/DashboardHome.jsx
import React from 'react';
import { Grid, Box } from '@mui/material';
import OverviewCards from './OverviewCards';
import SalesChart from './SalesChart';
import RecentOrders from './RecentOrders';
import InventoryStatus from './InventoryStatus';
import ActivityFeed from './ActivityFeed';

const DashboardHome = () => {
  return (
    <Box>
      <OverviewCards />
      
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesChart />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ActivityFeed />
          </Grid>
        </Grid>
      </Box>
      
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RecentOrders />
          </Grid>
          <Grid item xs={12} lg={4}>
            <InventoryStatus />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardHome;