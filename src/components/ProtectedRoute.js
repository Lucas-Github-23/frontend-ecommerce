import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly }) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userInfo.email !== 'kukagabriel@hotmail.com') {
    // Se a rota é só para admin e o usuário não é o admin, redireciona para a home
    return <Navigate to="/" replace />;
  }

  // Se passou nas verificações, renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;