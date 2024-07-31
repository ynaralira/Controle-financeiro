import React from 'react';
import ValorTotalEntrada from './ValorTotalEntrada';
import ValorTotalSaida from './ValorTotalSaida';
import ValorTotalInvestimentos from './ValorTotalInvestimentos';

const ValorTotalTodos = () => {
  const totalEntrada = ValorTotalEntrada();
  const totalSaida = ValorTotalSaida();
  const totalInvestimentos = ValorTotalInvestimentos();
  const somaTotal = Number(totalEntrada) + Number(totalSaida) + Number(totalInvestimentos);


  return somaTotal;
};

export default ValorTotalTodos;
