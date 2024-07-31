import React from 'react';
import jsPDF from 'jspdf';
import XLSX from 'xlsx';

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



function Buttons({ transacoes, tipoTransacao }) {
  return (
    <div className="container-buttons">
      <button onClick={() => exportarPDF(transacoes, tipoTransacao)}>
        <i className="fi fi-rr-file-pdf"></i> Imprimir Pdf
      </button>
    </div>
  );
}

export default Buttons;
