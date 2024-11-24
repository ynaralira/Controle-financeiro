import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ValorTotalEntrada from '../componentes/ValorTotal/ValorTotalEntrada';
import ValorTotalSaida from '../componentes/ValorTotal/ValorTotalSaida';
import ValorTotalPago from '../componentes/ValorTotal/ValorTotalPago';
import { useAuth } from '../componentes/AuthContext';
import Alert from '../componentes/Alert/Alert';
import Header from '../componentes/Header/Header';
import ButtonsHome from '../componentes/Buttons/ButtonsHome/ButtonsHome';
import ListaTransacoes from '../componentes/ListaTransacoes/ListaTransacoes'; 
import Sidebar from '../componentes/Sidebar/Sidebar';

const Home = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSaidas, setTotalSaidas] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0);
  const [transacoesEntradas, setTransacoesEntradas] = useState([]); 
  const [transacoesSaidas, setTransacoesSaidas] = useState([]); 
  const [transacoesPagas, setTransacoesPagas] = useState([]); 
  const { alert, setAlert } = useAuth();

  const [insercaoFeita, setInsercaoFeita] = useState(false); 
  const [termoBusca, setTermoBusca] = useState(''); 

  const atualizarTotalEntradas = (novoTotal) => setTotalEntradas(novoTotal);
  const atualizarTotalSaidas = (novoTotal) => setTotalSaidas(novoTotal);
  const atualizarTotalPagos = (novoTotal) => setTotalPagos(novoTotal);

  const pesquisarTransacao = (termo) => setTermoBusca(termo);

  useEffect(() => {
    if (alert.message && alert.type === 'success') {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content container-principal">
        <Header onBuscar={pesquisarTransacao} />
        <div className="box-principal">
          <h1>Controle Financeiro</h1>
          {alert.message && (
            <Alert 
              message={alert.message} 
              type={alert.type} 
              onClose={() => setAlert({ message: '', type: '' })} 
            />
          )}
          <div className="menu">
            {/* Entradas */}
            <div className="card">
              <div className="card-body">
                <div className='title'>
                  <h2><i class="fi fi-rr-hand-holding-usd green"></i> Entradas</h2>
                </div>
                <p>R$ <ValorTotalEntrada atualizarTotalEntradas={atualizarTotalEntradas} transacoes={transacoesEntradas} /></p>
                <ButtonsHome link="entradas" transacoes={transacoesEntradas} tipoTransacao="Entradas" />
              </div>
            </div>
            {/* Despesas */}
            <div className="card">
              <div className="card-body">
                <div className='title'>
                  <h2><i class="fi fi-bs-cheap-dollar red"></i> Despesas </h2>
                </div>
                <p>R$ <ValorTotalSaida atualizarTotalSaidas={atualizarTotalSaidas} transacoes={transacoesSaidas} /></p>
                <ButtonsHome link="saidas" transacoes={transacoesSaidas} tipoTransacao="Despesas" />
              </div>
            </div>
            {/* Pagas */}
            <div className="card">
              <div className="card-body">
                <div className='title'>
                  <h2><i class="fi fi-rs-ad-paid blue"></i> Pagas</h2>
                </div>
                <p>R$ <ValorTotalPago atualizarTotalPagos={atualizarTotalPagos} transacoes={transacoesPagas} /></p>
                <ButtonsHome link="pagos" transacoes={transacoesPagas} tipoTransacao="Pagas" />
              </div>
            </div>
          </div>
          {/* Lista de Transações */}
          <ListaTransacoes 
            insercaoFeita={insercaoFeita} 
            termoBusca={termoBusca} 
            atualizarTotalSaidas={atualizarTotalSaidas} 
            atualizarTotalEntradas={atualizarTotalEntradas} 
            atualizarTotalPagos={atualizarTotalPagos}
          /> 
        </div>
      </div>
    </div>
  );
};

export default Home;
