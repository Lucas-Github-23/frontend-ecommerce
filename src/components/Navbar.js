import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FiShoppingCart, FiHome, FiPackage, FiShield, FiLogIn, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ReactStore
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <FiHome /> <span className="nav-link-text">Início</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-links">
              <FiPackage /> <span className="nav-link-text">Produtos</span>
            </Link>
          </li>
          
          {/* Condição para Admin */}
          {userInfo && userInfo.email === 'kukagabriel@hotmail.com' && (
            <li className="nav-item">
              <Link to="/admin" className="nav-links">
                <FiShield /> <span className="nav-link-text">Admin</span>
              </Link>
            </li>
          )}

          {userInfo ? (
            <li className="nav-item user-menu">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="nav-links user-menu-button">
                <FiUser /> <span className="nav-link-text">{userInfo.name.split(' ')[0]}</span> <FiChevronDown />
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>Meu Perfil</Link>
                  <button onClick={logoutHandler}>
                    <FiLogOut /> Sair {/* Ícone adicionado aqui */}
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links">
                <FiLogIn /> <span className="nav-link-text">Login</span>
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/cart" className="nav-links nav-cart-link">
              <FiShoppingCart /> 
              <span className="cart-badge">{totalItems}</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;