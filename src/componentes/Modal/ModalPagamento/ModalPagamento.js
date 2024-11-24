import React, { useState } from 'react';
import './ModalPagamento.css';

const ModalPagamento = ({ onConfirm, onClose }) => {
    const [date, setDate] = useState('');

    const handleConfirm = () => {
        if (date) {
            onConfirm(date); 
        } else {
            alert('Por favor, informe uma data de pagamento.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-header'>
                    <h3>Confirmação</h3>
                    <button type='button' className='cancel-btn' onClick={onClose}>X</button>
                </div>
                <p>Qual foi a data de pagamento?</p>
                <input 
                    type='date' 
                    name='dt_pago' 
                    id='dt_pago' 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
                <div className="modal-actions">
                    <button type='button' className='confirm-btn' onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalPagamento;
