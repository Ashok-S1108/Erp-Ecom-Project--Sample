import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage, 
  FiTruck, 
  FiDollarSign, 
  FiPieChart, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft, 
  FiChevronRight,
  FiBox,
  FiShoppingBag,
  FiFileText,
  FiBarChart2,
  FiDatabase,
  FiUserCheck,
  FiLayers,
  FiActivity
} from 'react-icons/fi';
import {
  Avatar,
  Badge,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import './AdminSidebar.css';

const AdminSidebar = ({ mobileOpen, onMobileToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  const user = {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/admin-avatar.png',
    role: 'Super Admin'
  };

  const menuItems = [
    { 
      path: '', 
      icon: <FiHome />, 
      label: 'Dashboard',
      badge: 3
    },
    {
      title: 'E-Commerce',
      icon: <FiShoppingCart />,
      items: [
        { path: 'products', icon: <FiPackage />, label: 'Products', badge: 12 },
        { path: 'orders', icon: <FiShoppingBag />, label: 'Orders', badge: 5 },
        { path: 'customers', icon: <FiUsers />, label: 'Customers', badge: 8 },
      ]
    },
    {
      title: 'Inventory & ERP',
      icon: <FiDatabase />,
      items: [
        { path: 'inventory', icon: <FiBox />, label: 'Inventory', badge: 3 },
        { path: 'suppliers', icon: <FiTruck />, label: 'Suppliers' },
        { path: 'procurement', icon: <FiLayers />, label: 'Procurement' },
      ]
    },
    {
      title: 'Analytics & Reports',
      icon: <FiBarChart2 />,
      items: [
        { path: 'reports/sales', icon: <FiDollarSign />, label: 'Sales Reports' },
        { path: 'reports/inventory', icon: <FiActivity />, label: 'Inventory Reports' },
        { path: 'reports/financial', icon: <FiPieChart />, label: 'Financial Reports' },
      ]
    },
    {
      title: 'System & Settings',
      icon: <FiSettings />,
      items: [
        { path: 'settings', icon: <FiSettings />, label: 'System Settings' },
        { path: 'users', icon: <FiUserCheck />, label: 'User Management' },
        { path: 'audit-logs', icon: <FiFileText />, label: 'Audit Logs' },
      ]
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  const isSubmenuActive = (items) => {
    return items.some(item => location.pathname.includes(item.path));
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <div className="brand-logo">
              <FiDatabase className="logo-icon" />
            </div>
            <Typography variant="h6" className="brand-text">
              Admin Panel
            </Typography>
          </div>
        )}
        <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <IconButton className="toggle-btn" onClick={toggleSidebar} size="small">
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </IconButton>
        </Tooltip>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="user-profile">
          <Avatar 
            src={user.avatar} 
            className="user-avatar"
            sx={{ width: 64, height: 64 }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <div className="user-info">
            <Typography variant="subtitle1" className="user-name">
              {user.name}
            </Typography>
            <Typography variant="body2" className="user-role">
              {user.role}
            </Typography>
            <Typography variant="caption" className="user-email">
              {user.email}
            </Typography>
          </div>
        </div>
      )}

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.path ? (
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">
                  {item.icon}
                  {item.badge && !isCollapsed && (
                    <Badge badgeContent={item.badge} color="error" size="small" />
                  )}
                </span>
                {!isCollapsed && (
                  <span className="nav-label">
                    {item.label}
                    {item.badge && (
                      <Badge badgeContent={item.badge} color="error" className="nav-badge" />
                    )}
                  </span>
                )}
              </NavLink>
            ) : (
              <div className="menu-section">
                {!isCollapsed && item.title && (
                  <Typography variant="caption" className="menu-title">
                    {item.title}
                  </Typography>
                )}
                
                {item.items && item.items.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) => 
                      `nav-item sub-item ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="nav-icon">
                      {subItem.icon}
                      {subItem.badge && !isCollapsed && (
                        <Badge badgeContent={subItem.badge} color="error" size="small" />
                      )}
                    </span>
                    {!isCollapsed && (
                      <span className="nav-label">
                        {subItem.label}
                        {subItem.badge && (
                          <Badge badgeContent={subItem.badge} color="error" className="nav-badge" />
                        )}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Divider sx={{ mx: 2, mb: 2 }} />
        <NavLink to="/logout" className="nav-item logout-item">
          <span className="nav-icon">
            <FiLogOut />
          </span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </NavLink>
        
        {!isCollapsed && (
          <Typography variant="caption" className="sidebar-version">
            v2.1.0 • © 2024 ERP System
          </Typography>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;