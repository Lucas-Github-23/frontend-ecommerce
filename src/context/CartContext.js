import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../api/axiosConfig'; // Alterado para usar a configuração central do Axios
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userInfo } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    if (userInfo) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/cart', config);
        
        const formattedCart = data.map(item => ({
          ...item.product,
          quantity: item.quantity,
        }));
        setCartItems(formattedCart);

      } catch (error) {
        console.error("Erro ao buscar o carrinho:", error);
        if (error.response && error.response.status === 401) {
            setCartItems([]);
        }
      }
    } else {
      setCartItems([]);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    if (!userInfo) {
      alert('Por favor, faça login para adicionar itens ao carrinho.');
      return;
    }
    
    const existingItem = cartItems.find(item => item._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/cart', { productId: product._id, quantity }, config);
      fetchCart();
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/cart/${productId}`, config);
      fetchCart();
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const newQuantity = Number(quantity);
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/cart', { productId, quantity: newQuantity }, config);
      fetchCart();
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      await removeFromCart(item._id);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};