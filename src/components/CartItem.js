import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi'; // Importando ícone
import './CartItem.css';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p>Preço: R$ {item.price.toFixed(2)}</p>
        <div className="cart-item-quantity">
          <label>Qtd: </label>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item._id, e.target.value)}
            min="1"
          />
        </div>
      </div>
      <button onClick={() => removeFromCart(item._id)} className="remove-item-btn">
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;