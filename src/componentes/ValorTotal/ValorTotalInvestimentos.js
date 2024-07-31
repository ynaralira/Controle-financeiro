import React, { useState, useEffect } from 'react';

const ValorTotalInvestimentos = () => {
  const [somaInvestimentos, setSomaInvestimentos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/php/index.php");
        const data = await response.json();

        const valoresInvestimentos = data.valor_investimento.map(item => parseFloat(item.valor));
        const somaInvestimentos = valoresInvestimentos.reduce((total, valor) => total + valor, 0);
        setSomaInvestimentos(somaInvestimentos);
      } catch (error) {
        console.error('Erro ao buscar os valores de investimentos:', error);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (number) => {
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <span>{formatNumber(somaInvestimentos)}</span>
  );
};

export default ValorTotalInvestimentos;
