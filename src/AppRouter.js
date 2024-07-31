import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom'; 
import Home from './pages/Home';
import Entradas from './pages/Entradas';
import Saidas from './pages/Saidas';
import Pagos from './pages/Pagos';
import Login from './pages/Login';

// Arquivo que declara as rotas/paginas do projeto

const AppRoutes = () => { 
  return (
    <ReactRoutes> 
      <Route exact path="/" element={<Login />} /> 
      <Route exact path="/home" element={<Home />} /> 
      <Route path="/entradas" element={<Entradas />} /> 
      <Route path='/saidas' element={<Saidas/> } />
      <Route path='/pagos' element={<Pagos/> } />
    </ReactRoutes> 
  );
};

export default AppRoutes; 
