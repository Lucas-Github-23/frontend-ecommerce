import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi'; // Importando ícone
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setError('');
      } catch (err) {
        setError('Produto não encontrado ou erro ao carregar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading-message">Carregando detalhes do produto...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className="product-category">Categoria: {product.category}</p>
        <p className="product-description">{product.description}</p>
        <button onClick={() => addToCart(product)} className="add-to-cart-btn">
          <FiShoppingCart /> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;