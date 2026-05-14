// contexts/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        loading: false,
        error: null
      };
    case 'ADD_ITEM':
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.product_id._id === action.payload.product_id
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return { 
          ...state, 
          items: [...state.items, action.payload] 
        };
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Fetch cart on component mount if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/cart');
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to load cart' 
      });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', {
        product_id: productId,
        quantity: quantity
      });
      
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: response.data.item 
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Add to cart error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return { success: true, message: 'Item removed from cart' };
      }

      const response = await api.put(`/cart/update/${itemId}`, {
        quantity: quantity
      });
      
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { itemId, quantity } 
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Update quantity error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update quantity' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/remove/${itemId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      dispatch({ type: 'CLEAR_CART' });
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.product_id.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      loading: state.loading,
      error: state.error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};