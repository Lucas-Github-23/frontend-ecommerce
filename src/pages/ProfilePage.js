import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Alterado para usar a configuração central do Axios
import { AuthContext } from '../context/AuthContext';
import './AuthForm.css';

const ProfilePage = () => {
  const { userInfo, updateUser } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const { data } = await axios.put('/api/auth/profile', updateData, config);
      
      updateUser(data);
      setMessage('Perfil atualizado com sucesso!');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar o perfil.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Meu Perfil</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Nova Senha (deixe em branco para manter a atual)</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit" className="auth-button">Atualizar Perfil</button>
      </form>
    </div>
  );
};

export default ProfilePage;