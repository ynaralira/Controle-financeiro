import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Add.css';

function Add({ onInsert, tipoTransacao }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [valor, setValor] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');
    const { userId } = useAuth(); 

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleAdd = () => {
        if (!userId) {
            console.error('ID do usuário ausente');
            return;
        }

        const dados = {
            descricao,
            data,
            valor,
            formaPagamento,
            tipoTransacao,
            id_usuario: userId 
        };

        
        fetch('https://controle-financeiro-git-main-ynaraliras-projects.vercel.app/insert__dados_lista.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar os dados.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados enviados com sucesso:', data);
            onInsert();
            closeModal();
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
        });
    };

    return (
        <>
            <button className="btn-add" onClick={openModal}><i className="fi fi-br-plus"></i></button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        <h2>Registrar</h2>
                        <div className="input-container">
                            <input type='text' placeholder='Digite aqui a descrição' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <input type='date' value={data} onChange={(e) => setData(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <input type='number' placeholder='Digite o valor' value={valor} onChange={(e) => setValor(e.target.value)} />
                        </div>
                        <div className="input-container">
                            <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                                <option value="">Forma de pagamento</option>
                                <option value="1">Dinheiro</option>
                                <option value="2">Cartão de Crédito</option>
                                <option value="3">Cartão de Débito</option>
                                <option value="4">Pix</option>
                            </select>
                        </div>
                        <div className="input-container">
                            <button className="add-button" onClick={handleAdd}>Adicionar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Add;