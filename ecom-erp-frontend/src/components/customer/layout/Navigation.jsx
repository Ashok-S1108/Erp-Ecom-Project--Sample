// src/components/customer/layout/Navigation.jsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  ShoppingBag,
  Category,
  Person,
  Favorite,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <ShoppingBag />, text: 'Products', path: '/products' },
    { icon: <Category />, text: 'Categories', path: '/categories' },
    { icon: <Favorite />, text: 'Wishlist', path: '/wishlist' },
    { icon: <History />, text: 'Order History', path: '/orders' },
    { icon: <Person />, text: 'Profile', path: '/profile' }
  ];

  return (
    <>
      <IconButton onClick={() => setDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem button onClick={() => navigate('/login')}>
            <ListItemText primary="Sign In" />
          </ListItem>
          <ListItem button onClick={() => navigate('/register')}>
            <ListItemText primary="Create Account" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navigation;