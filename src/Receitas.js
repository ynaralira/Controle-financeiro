import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';

function Receitas() {

const [receitas, setReceitas] = useState([]);
const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost/php/index.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data); 
        setReceitas(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
      });
  }, []);

  const add = () => {
    let novaDescricao = prompt("Digite a descricao:");
    let novoTipo = prompt("Digite o tipo:");
    let novoValor = prompt("Digite o valor:");
    
    let dataAtual = new Date().toLocaleDateString();
  
    fetch('http://localhost/php/insert.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao: novaDescricao,
        tipo: novoTipo,
        valor: novoValor,
        data: dataAtual 
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response data:', data); 
      if (data.success) {
        const novaReceita = {
          descricao: novaDescricao,
          tipo: novoTipo,
          valor_lucro: novoValor,
          data: dataAtual  
        };
        setReceitas([...receitas, novaReceita]);
      } else {
        console.error('Error inserting data:', data.error);
      }
    })
    .catch(error => {
      console.error('Error inserting data:', error);
    });
  };
  

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Header />
        <div className='content'>
        <h1>Minhas Receitas</h1>
        <button type="button" className='add' onClick={add}><i className="fi fi-rr-add"></i> Adicionar</button>
        </div>
        <div className='principal-receitas'>
        <ul>
          {receitas.map((receita, index) => (
            <li key={index}>
              <h4>{receita.descricao}</h4>
              <p>Tipo: {receita.tipo}</p>
              <p>Data: {receita.data}</p>
              <p>Valor: R$ {receita.valor_lucro}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Receitas;
