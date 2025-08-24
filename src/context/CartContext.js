import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userInfo } = useContext(AuthContext);

  // Usamos useCallback para evitar recriar a função em cada renderização
  const fetchCart = useCallback(async () => {
    if (userInfo) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/cart', config);
        
        // A correção principal está aqui:
        // Mapeamos os dados da API para o formato que os componentes esperam
        const formattedCart = data.map(item => ({
          ...item.product, // Espalha todas as propriedades do produto (name, price, etc.)
          quantity: item.quantity, // Adiciona a quantidade
        }));
        setCartItems(formattedCart);

      } catch (error) {
        console.error("Erro ao buscar o carrinho:", error);
        // Se o token expirar ou for inválido, limpa o carrinho local
        if (error.response && error.response.status === 401) {
            setCartItems([]);
        }
      }
    } else {
      // Limpa o carrinho se o usuário fizer logout
      setCartItems([]);
    }
  }, [userInfo]);

  // Busca o carrinho quando o componente é montado ou o usuário muda
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
      await axios.post('http://localhost:5000/api/cart', { productId: product._id, quantity }, config);
      fetchCart(); // Re-busca o carrinho para garantir que o estado está sincronizado
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, config);
      fetchCart(); // Re-busca o carrinho
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
      await axios.post('http://localhost:5000/api/cart', { productId, quantity: newQuantity }, config);
      fetchCart(); // Re-busca o carrinho
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  const clearCart = async () => {
    // Para limpar o carrinho, removemos cada item individualmente
    // Uma rota de "clear all" no backend seria mais eficiente, mas isso funciona
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