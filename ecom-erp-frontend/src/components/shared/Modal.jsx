// src/components/shared/Modal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Slide
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
//import './Modal.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      className="custom-modal"
    >
      <DialogTitle className="modal-title">
        <Box className="title-content">
          {title}
          <IconButton
            onClick={onClose}
            className="close-button"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className="modal-content">
        {children}
      </DialogContent>

      {actions && (
        <DialogActions className="modal-actions">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;