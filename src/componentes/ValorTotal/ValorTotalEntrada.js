import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ValorTotalEntrada = ({ totalEntradas, atualizarTotalEntradas }) => {
  const [somaEntradas, setSomaEntradas] = useState(totalEntradas);
  const location = useLocation();
  const { contaId } = useAuth();

  const atualizarSomaEntradas = useCallback((valor) => {
    setSomaEntradas(valor);
    atualizarTotalEntradas(valor);
  }, [atualizarTotalEntradas]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/Controle-financeiro/back-end/index.php", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_conta: contaId }),
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar os valores de entradas');
        }

        const data = await response.json();
        const valoresEntradas = data.valor_entrada.map(item => parseFloat(item.valor));
        const soma = valoresEntradas.reduce((total, valor) => total + valor, 0);
        atualizarSomaEntradas(soma);
      } catch (error) {
        console.error('Erro ao buscar os valores de entradas:', error);
      }
    };

    if (location.pathname === '/home' && contaId) {
      fetchData();
    } else {
      atualizarSomaEntradas(totalEntradas);
    }
  }, [location.pathname, contaId, totalEntradas, atualizarSomaEntradas]);

  const formatNumber = (number) => {
    if (isNaN(number)) {
      return '0,00';
    }
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return <span>{formatNumber(somaEntradas)}</span>;
};

export default ValorTotalEntrada;
