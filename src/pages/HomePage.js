import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Alterado para usar a configuração central do Axios
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        const featured = response.data.filter(product => product.isFeatured);
        setFeaturedProducts(featured);
        setError('');
      } catch (err) {
        setError('Não foi possível carregar os produtos em destaque.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) return <p className="loading-message">Carregando produtos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Bem-vindo à NG Store!🤫</h1>
        <p>Confira nossos produtos em destaque.</p>
      </header>
      <div className="product-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>Nenhum produto em destaque no momento.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
