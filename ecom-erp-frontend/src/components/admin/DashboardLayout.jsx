import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import NotificationBar from './NotificationBar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const toggleNotifications = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        mobileOpen={mobileSidebarOpen}
        onMobileToggle={toggleMobileSidebar}
      />
      
      <div className="main-content">
        <AdminHeader 
          toggleMobileSidebar={toggleMobileSidebar}
          toggleNotifications={toggleNotifications}
        />
        
        <NotificationBar 
          isOpen={notificationOpen}
          onClose={() => setNotificationOpen(false)}
        />
        
        <div className="content-wrapper">
          {/* Nested admin routes render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;