import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const ValorTotalPago = ({ totalPagos, atualizarTotalPagos }) => {
  const [somaPagos, setSomaPagos] = useState(totalPagos);
  const location = useLocation();
  const { userId } = useAuth(); 

  useEffect(() => {
    if (location.pathname === '/home' && userId) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost/php/index.php", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_usuario: userId }), 
          });

          const data = await response.json();

          const valoresPagos = data.valor_pagos.map(item => parseFloat(item.valor));
          const somaPagos = valoresPagos.reduce((total, valor) => total + valor, 0);
          setSomaPagos(somaPagos);
          atualizarTotalPagos(somaPagos); 
        } catch (error) {
          console.error('Erro ao buscar os valores de pagos:', error);
        }
      };

      fetchData();
    } else {
      setSomaPagos(totalPagos);
      atualizarTotalPagos(totalPagos); 
    }
  }, [location.pathname, atualizarTotalPagos, totalPagos, userId]); 

  const formatNumber = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
      return '0,00';
    }
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <span>{formatNumber(somaPagos)}</span>
  ); 
};

export default ValorTotalPago;
