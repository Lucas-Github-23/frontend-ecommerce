import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig'; // Alterado para usar a configuração central do Axios
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: 1,
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState(null);
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
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('description', formData.description);
    submissionData.append('price', formData.price);
    submissionData.append('category', formData.category);
    submissionData.append('inStock', formData.inStock);
    submissionData.append('isFeatured', formData.isFeatured);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const method = editingId ? 'put' : 'post';
    const url = editingId ? `/api/products/${editingId}` : '/api/products';

    try {
      await axios[method](url, submissionData, config);
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
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
      isFeatured: product.isFeatured,
    });
    setImageFile(null);
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
    setFormData({ name: '', description: '', price: '', category: '', inStock: 1, isFeatured: false });
    setImageFile(null);
    if (document.getElementById('image-upload')) {
        document.getElementById('image-upload').value = null;
    }
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
          <input type="number" name="inStock" value={formData.inStock} onChange={handleChange} placeholder="Estoque" required min="0" />
          <label htmlFor="image-upload">Imagem do Produto</label>
          <input id="image-upload" type="file" name="image" onChange={handleFileChange} required={!editingId} />
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
      {/* Tabela de produtos */}
    </div>
  );
};

export default AdminPage;