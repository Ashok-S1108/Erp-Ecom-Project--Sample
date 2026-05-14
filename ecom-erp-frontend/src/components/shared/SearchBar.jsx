// src/components/shared/SearchBar.jsx
import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
//import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setAnchorEl(null);
    }
  };

  const fetchSuggestions = async (term) => {
    // Simulate API call for search suggestions
    const mockSuggestions = [
      'Smartphones',
      'Laptops',
      'Headphones',
      'Cameras',
      'Watches'
    ].filter(item => item.toLowerCase().includes(term.toLowerCase()));
    
    setSuggestions(mockSuggestions);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      fetchSuggestions(value);
      setAnchorEl(e.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setAnchorEl(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setAnchorEl(null);
  };

  return (
    <Box className="search-bar-container">
      <Paper
        component="form"
        onSubmit={handleSearch}
        className="search-paper"
      >
        <InputBase
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
          startAdornment={
            <IconButton type="submit" size="small">
              <SearchIcon />
            </IconButton>
          }
          endAdornment={
            searchTerm && (
              <IconButton onClick={clearSearch} size="small">
                <ClearIcon />
              </IconButton>
            )
          }
        />
      </Paper>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        className="suggestions-popover"
      >
        <Box className="suggestions-container">
          {suggestions.length > 0 ? (
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  <SearchIcon fontSize="small" />
                  <ListItemText 
                    primary={suggestion} 
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box className="no-suggestions">
              <Typography variant="body2" color="text.secondary">
                No suggestions found
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default SearchBar;