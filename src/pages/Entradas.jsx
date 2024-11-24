import React, { useState } from 'react';
import Sidebar from '../componentes/Sidebar/Sidebar';
import Header from '../componentes/Header/Header';
import ValorTotalEntrada from '../componentes/ValorTotal/ValorTotalEntrada';
import ListaTransacoes from '../componentes/ListaTransacoes/ListaTransacoes';
import Add from '../componentes/Add/Add';

const Entradas = () => {
  const [insercaoFeita, setInsercaoFeita] = useState(false); 
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [termoBusca, setTermoBusca] = useState(''); 

  const atualizarTotalEntradas = (novoTotal) => {
    setTotalEntradas(novoTotal);
  };

  const pesquisarTransacao = (termo) => {
    setTermoBusca(termo);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content container-principal">
        <Header onBuscar={pesquisarTransacao} />
        <div className='container-entradas'>
          <div className='box'>
            <div className='inicio'>
              <h1>Entradas</h1>
              <Add 
                onInsert={() => setInsercaoFeita(!insercaoFeita)} 
                atualizarTotalEntradas={atualizarTotalEntradas} 
                tipoTransacao="entrada" 
              />
            </div>
            <div className="total-entradas">
              Total: <span className="valor">R$ <ValorTotalEntrada totalEntradas={totalEntradas} atualizarTotalEntradas={atualizarTotalEntradas} /></span> 
            </div>
            <ListaTransacoes 
              insercaoFeita={insercaoFeita} 
              termoBusca={termoBusca} 
              atualizarTotalSaidas={atualizarTotalEntradas} 
            /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entradas;
