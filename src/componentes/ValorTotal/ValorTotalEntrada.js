import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Certifique-se de importar o hook useAuth

const ValorTotalEntrada = ({ totalEntradas, atualizarTotalEntradas }) => {
  const [somaEntradas, setSomaEntradas] = useState(totalEntradas);
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

          const valoresEntradas = data.valor_entrada.map(item => parseFloat(item.valor));
          const somaEntradas = valoresEntradas.reduce((total, valor) => total + valor, 0);
          setSomaEntradas(somaEntradas);
          atualizarTotalEntradas(somaEntradas); 
        } catch (error) {
          console.error('Erro ao buscar os valores de entradas:', error);
        }
      };

      fetchData();
    } else {
      setSomaEntradas(totalEntradas);
      atualizarTotalEntradas(totalEntradas); 
    }
  }, [location.pathname, atualizarTotalEntradas, totalEntradas, userId]); 

  const formatNumber = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
      return '0,00';
    }
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <span>{formatNumber(somaEntradas)}</span>
  ); 
};

export default ValorTotalEntrada;
