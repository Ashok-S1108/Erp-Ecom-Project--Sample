import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  History as HistoryIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import SearchBar from '../../shared/SearchBar';
import './Header.css';

const Header = ({ onCartOpen }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount, items } = useCart(); // Added items for safety
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Products', path: '/products' },
    { text: 'Categories', path: '/categories' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  // Safe cart items count calculation
  const cartItemsCount = Array.isArray(items) ? getCartItemsCount() : 0;

  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    handleProfileMenuClose();
  };

  const handleCartClick = () => {
    if (onCartOpen) {
      onCartOpen();
    } else {
      // Fallback: navigate to cart page if onCartOpen is not provided
      navigate('/cart');
    }
  };

  const profileMenuOpen = Boolean(profileAnchor);

  return (
    <AppBar position="fixed" className="header">
      <Toolbar className="toolbar">
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
          className="menu-button"
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Link to="/" className="logo">
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            ShopEasy
          </Typography>
        </Link>

        {/* Desktop Navigation */}
        <Box className="nav-menu" sx={{ display: { xs: 'none', md: 'flex' } }}>
          {menuItems.map((item) => (
            <Link 
              key={item.text} 
              to={item.path} 
              className="nav-link"
            >
              {item.text}
            </Link>
          ))}
        </Box>

        {/* Header Actions */}
        <Box className="header-actions">
          <SearchBar />
          
          {/* Cart Icon - Always visible */}
          <Tooltip title="View Cart">
            <IconButton color="inherit" onClick={handleCartClick}>
              <Badge 
                badgeContent={cartItemsCount} 
                color="secondary"
                max={99}
                showZero={false}
              >
                <CartIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {isAuthenticated() ? (
            <>
              {/* User Profile Menu - Only shown when authenticated */}
              <IconButton 
                color="inherit" 
                onClick={handleProfileMenuOpen}
                className="profile-button"
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.light',
                    fontSize: '14px'
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={profileAnchor}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <MenuItem disabled>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${user?.firstName} ${user?.lastName}`}
                    secondary={user?.email}
                    sx={{ '& .MuiListItemText-secondary': { fontSize: '0.75rem' } }}
                  />
                </MenuItem>
                <Divider />

                {/* Profile Options */}
                <MenuItem onClick={() => handleProfileNavigation('/profile')}>
                  <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </MenuItem>

                <MenuItem onClick={() => handleProfileNavigation('/orders')}>
                  <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Order History" />
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Login/Register buttons - Only shown when NOT authenticated */
            <Box className="auth-buttons" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                color="inherit" 
                component={Link}
                to="/login"
                className="login-button"
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit"
                component={Link}
                to="/register"
                className="register-button"
                sx={{ 
                  ml: 1,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Box className="mobile-menu" sx={{ width: 250 }}>
            <Box className="mobile-menu-header">
              <Typography variant="h6" sx={{ p: 2 }}>
                ShopEasy
              </Typography>
              <Divider />
            </Box>

            <List>
              {menuItems.map((item) => (
                <ListItem 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>

            <Divider />

            {/* Mobile Auth Section */}
            {isAuthenticated() ? (
              <List>
                <ListItem 
                  button 
                  onClick={() => {
                    handleProfileNavigation('/profile');
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <ProfileIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItem>
                
                <ListItem 
                  button 
                  onClick={() => {
                    handleProfileNavigation('/orders');
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Order History" />
                </ListItem>
                
                <ListItem button onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            ) : (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{ mb: 1 }}
                  onClick={() => setDrawerOpen(false)}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to="/register"
                  onClick={() => setDrawerOpen(false)}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;