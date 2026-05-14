import React from 'react';
import { FiBell, FiSearch, FiUser, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ toggleMobileSidebar, toggleNotifications }) => {
  const navigate = useNavigate();

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={toggleMobileSidebar}>
          <FiMenu />
        </button>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn" onClick={toggleNotifications}>
          <FiBell />
          <span className="badge">3</span>
        </button>
        
        <div className="user-profile" onClick={() => navigate('/admin/users')}>
          <div className="avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;