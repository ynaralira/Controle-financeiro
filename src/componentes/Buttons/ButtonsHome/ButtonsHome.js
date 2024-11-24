import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ButtonsHome.css';
import jsPDF from 'jspdf';



function exportarPDF(transacoes, tipoTransacao) {
  const doc = new jsPDF();
  let linhas = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Transações de ${tipoTransacao}`, 20, linhas);

  linhas += 20;

  transacoes.forEach(item => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Descrição: ${item.DESCRICAO}\nData: ${item.DATA}\nValor:  ${item.VALOR}\n`, 20, linhas);
    linhas += 20;
  });

  doc.save(`Transacoes_${tipoTransacao}.pdf`);
}

function ButtonsHome({ link, transacoes, tipoTransacao }) {
  const navigate = useNavigate(); 

  const handleClick = () => {
  navigate(`/${link}`); 
  };

  return (
    <div className='buttons-principal'>
      
        <button className='view' onClick={handleClick}>
           <i className="fi fi-rs-eye"></i>
        </button>
     
      <button className='pdf' onClick={() => exportarPDF(transacoes, tipoTransacao)}>
        <i className="fi fi-rr-file-pdf"></i>
      </button>
    </div>
  );
}

export default ButtonsHome;
