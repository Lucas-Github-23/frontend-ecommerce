import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  // Garante que o reduce não quebre se cartItems for undefined
  const subtotal = (cartItems || []).reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-items-container">
        <h2>Seu Carrinho de Compras</h2>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map(item => (
            <CartItem key={item._id} item={item} />
          ))
        ) : (
          <p>Seu carrinho está vazio.</p>
        )}
      </div>

      {cartItems && cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Resumo do Pedido</h3>
          <p>Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong></p>
          <div className="cart-actions">
              <button className="checkout-btn">Finalizar Compra</button>
              <button onClick={clearCart} className="clear-cart-btn">Limpar Carrinho</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;