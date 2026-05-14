import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          // Verify the token is still valid
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Fetch user data with timeout to prevent hanging
          const response = await Promise.race([
            api.get('/user/profile'),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 5000)
            )
          ]);
          
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Authentication initialization failed:', error);
          // Token is invalid or expired
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setToken(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken, userData) => {
    try {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Failed to save authentication data' };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      
      // Optional: Call logout API endpoint to invalidate token on server
      // api.post('/auth/logout').catch(console.error);
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};