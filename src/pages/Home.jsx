import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ValorTotalEntrada from '../componentes/ValorTotal/ValorTotalEntrada';
import ValorTotalSaida from '../componentes/ValorTotal/ValorTotalSaida';
import ValorTotalPago from '../componentes/ValorTotal/ValorTotalPago';
import { useAuth } from '../componentes/AuthContext';
import Alert from '../componentes/Alert/Alert';
import Header from '../componentes/Header/Header';

const Home = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalSaidas, setTotalSaidas] = useState(0);
  const [totalPagos, setTotalPagos] = useState(0);
  const { alert, setAlert } = useAuth();

  useEffect(() => {
    if (alert.message && alert.type === 'success') {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  const atualizarTotalEntradas = (total) => {
    setTotalEntradas(total);
  };

  const atualizarTotalSaidas = (total) => {
    setTotalSaidas(total);
  };

  const atualizarTotalPagos = (total) => {
    setTotalPagos(total);
  };

  return (
    <div className='container-principal'>
      <Header />
      <div className='box'>
        <h1>Controle Financeiro</h1>
      </div>
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />}
      <div className='menu'>
        <Link to="/entradas" className="link">
          <h2>Entradas</h2>
          <p>R$ <ValorTotalEntrada atualizarTotalEntradas={atualizarTotalEntradas} /></p>
        </Link>
        <Link to="/saidas" className="link">
          <h2>Despesas</h2>
          <p>R$ <ValorTotalSaida atualizarTotalSaidas={atualizarTotalSaidas} /></p>
        </Link>
        <Link to="/pagos" className="link">
          <h2>Despesas pagas</h2>
          <p>R$ <ValorTotalPago atualizarTotalPagos={atualizarTotalPagos} /></p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
