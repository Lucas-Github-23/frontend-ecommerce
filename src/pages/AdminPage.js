import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '', // Campo para a URL da imagem
    inStock: 1,
    isFeatured: false,
  });
  const [editingId, setEditingId] = useState(null);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json', // Voltamos a enviar JSON
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const method = editingId ? 'put' : 'post';
    const url = editingId 
      ? `/api/products/${editingId}` 
      : '/api/products';

    try {
      // Enviamos o formData diretamente, sem FormData
      await axios[method](url, formData, config);
      alert(`Produto ${editingId ? 'atualizado' : 'adicionado'} com sucesso!`);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Erro ao guardar produto:", error);
      alert("Falha ao guardar produto.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    // Preenchemos o formulário com todos os dados, incluindo a imageUrl
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      try {
        await axios.delete(`/api/products/${id}`, config);
        alert("Produto deletado com sucesso!");
        fetchProducts();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Falha ao deletar produto.");
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', description: '', price: '', category: '', imageUrl: '', inStock: 1, isFeatured: false,
    });
  };

  return (
    <div className="admin-page">
      <h2>Painel de Administração</h2>
      <div className="admin-form-container">
        <h3>{editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Produto" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descrição" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Preço" required min="0" step="0.01" />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Categoria" required />
          
          {/* Campo de texto para a URL da imagem */}
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL da Imagem" required />
          
          <input type="number" name="inStock" value={formData.inStock} onChange={handleChange} placeholder="Estoque" required min="0" />
          <label>
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
            Produto em Destaque?
          </label>
          <div className="form-buttons">
            <button type="submit">{editingId ? 'Atualizar' : 'Adicionar'}</button>
            {editingId && <button type="button" onClick={resetForm}>Cancelar Edição</button>}
          </div>
        </form>
      </div>
      <div className="admin-product-list">
        <h3>Lista de Produtos</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>R$ {product.price.toFixed(2)}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Editar</button>
                  <button onClick={() => handleDelete(product._id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
