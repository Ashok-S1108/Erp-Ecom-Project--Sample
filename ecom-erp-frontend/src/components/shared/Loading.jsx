// src/components/shared/Loading.jsx
import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
//import './Loading.css';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <Fade in={true} timeout={500}>
      <Box 
        className={`loading-container ${fullScreen ? 'full-screen' : ''}`}
      >
        <Box className="loading-content">
          <CircularProgress 
            size={fullScreen ? 60 : 40} 
            thickness={4}
            className="loading-spinner"
          />
          {message && (
            <Typography 
              variant="body1" 
              className="loading-text"
              sx={{ mt: fullScreen ? 2 : 1 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default Loading;