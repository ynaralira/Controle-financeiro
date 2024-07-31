import React, { useState } from 'react';
import './App.css';
import Receitas from './Receitas';
import Footer from './Footer';

function Menu() {
  const [currentPage, setCurrentPage] = useState('Total');
  const [hidePrincipal, setHidePrincipal] = useState(false);

  const handleReceitasClick = () => {
    setCurrentPage('Receitas');
    setHidePrincipal(true); 
  };

  const receitas = () => {
    console.log('Acessando a função Receitas...');
  };

  return (
    <div className='app'>
      <div className={`principal ${hidePrincipal ? 'hidden' : ''}`}>
        <h1>Controle Financeiro</h1>
        {currentPage !== 'Receitas' && (
          <ul>
            <li>Total</li>
            <li onClick={handleReceitasClick}>
            <i class="fi fi-rr-dollar"></i> 
            Receitas</li>
            <li>Despesas</li>
            <li>Investimentos</li>
          </ul>
        )}
        <Footer />
      </div>
      {currentPage === 'Receitas' && <Receitas receitasFunction={receitas} />}
    </div>
  );
}

export default Menu;
