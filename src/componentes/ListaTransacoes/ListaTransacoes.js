import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Buttons from '../Buttons';
import Icones from '../Icones';
import { useAuth } from '../AuthContext';
import Alert from '../Alert/Alert'; 
import './ListaTransacoes.css';
import ModalPagamento from '../Modal/ModalPagamento/ModalPagamento';

function ListaTransacoes({ insercaoFeita, termoBusca, atualizarTotalSaidas }) {
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [checkboxStates, setCheckboxStates] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' }); 
    const [modalVisible, setModalVisible] = useState(false);  
    const [dataPagamento, setDataPagamento] = useState(''); 
    const [modalHandlers, setModalHandlers] = useState({ onConfirm: () => {}, onClose: () => {} });
    const location = useLocation();
    const { contaId } = useAuth(); 

    const getIconForFormaPagamento = (idFormaPagamento) => {
        switch (idFormaPagamento) {
            case 1:
                return <i className="fi fi-rr-usd-circle"></i>;
            case 2:
                return <i className="fi fi-rr-credit-card"></i>;
            case 3:
                return <i className="fi fi-rs-credit-card"></i>;
            case 4:
                return <i className="fi fi-rs-coins"></i>;
            default:
                return <i className="fi fi-rs-coins"></i>;
        }
    };

    const formatarValor = (valor) => {
        if (Number.isInteger(parseFloat(valor))) {
            return parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        }
        return parseFloat(valor).toFixed(2).replace('.', ',');
    };

    const formatarData = (data) => {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const atualizarTotal = (novasTransacoes) => {
        const total = novasTransacoes.reduce((total, transacao) => total + parseFloat(transacao.VALOR), 0);
        atualizarTotalSaidas(total);
    };

    const registrarPagamento = async (index) => {
        try {
            const transacao = transacoes[index];
            const valorTransacao = parseFloat(transacao.VALOR);

            const dataPagamento = await new Promise((resolve, reject) => {
                setModalVisible(true); 
                const handleConfirm = (date) => {
                    setModalVisible(false); 
                    resolve(date); 
                };
                const handleCancel = () => {
                    setModalVisible(false); 
                    reject('Ação cancelada.');
                };

                setModalHandlers({ onConfirm: handleConfirm, onClose: handleCancel });
            }).catch((error) => {
                console.log(error);
                return null;
            });

            if (!dataPagamento) {
                return;
            }
            
            const exclusaoSucesso = await excluirEntradaCorrespondente(valorTransacao);
            if (!exclusaoSucesso) {
                return;
            }

            const response = await fetch("http://localhost/Controle-financeiro/back-end/registrar_pagamento.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: transacao.ID,
                    id_conta: contaId,
                    dt_pago: dataPagamento
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar pagamento');
            }
            fetchData();
        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            setAlert({ message: 'Erro ao registrar pagamento', type: 'error' });
        }
    };

    const excluirEntradaCorrespondente = async (valorTransacao) => {
        try {
            const response = await fetch("http://localhost/Controle-financeiro/back-end/excluir_entrada_correspondente.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    valor: valorTransacao,
                    id_conta: contaId 
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir entrada correspondente');
            }

            const result = await response.json();
            if (result.error !== undefined) {
                setAlert({ message: result.error, type: 'error' });
                return false;
            } else {
                setAlert({ message: result.message, type: 'success' });
                return true;
            }
        } catch (error) {
            console.error('Erro ao excluir entrada correspondente:', error);
            setAlert({ message: 'Erro ao excluir entrada correspondente', type: 'error' });
            return false; 
        }
    };

    const excluirTransacao = async (index, tipoTransacao) => {
        try {
            const transacao = transacoes[index];
            const response = await fetch("http://localhost/Controle-financeiro/back-end/excluir_transacao.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: transacao.ID,
                    tipo: tipoTransacao,
                    id_conta: contaId 
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir transação');
            }

            const result = await response.json();
            if (result.error !== undefined) {
                setAlert({ message: result.error, type: 'error' });
                return false;
            } else {
                fetchData();
                return true;
            }
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            setAlert({ message: 'Erro ao excluir transação', type: 'error' });
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost/Controle-financeiro/back-end/lista_transacoes.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_conta: contaId 
                }),
            });
            const data = await response.json();
    
            let transacoesLista = Array.isArray(data) ? data : [];
            const tipoTransacao = location.pathname.includes('entradas') ? 'entrada' : location.pathname.includes('saidas') ? 'saida' :  location.pathname.includes('pagos') ? 'pago' : 'todas';
    
            switch (tipoTransacao) {
                case 'entrada':
                    transacoesLista = data.transacao_entrada || [];
                    break;
                case 'saida':
                    transacoesLista = data.transacao_saida || [];
                    break;
                case 'pago':
                    transacoesLista = data.transacao_pagos || [];
                    break;
                case 'todas':
                    transacoesLista = data.transacao_todas || [];
                    break;
                default:
                    console.error('Tipo de transação inválido:', tipoTransacao);
                    break;
            }
    
            const transacoesFiltradas = transacoesLista.filter(transacao => 
                transacao.DESCRICAO && 
                transacao.DESCRICAO.toLowerCase().includes(termoBusca.toLowerCase())
            );
    
            const transacoesFormatadas = transacoesFiltradas.map(transacao => ({
                ...transacao,
                DATA: formatarData(transacao.DATA),
                ID_FORMA_PAGAMENTO: parseInt(transacao.ID_FORMA_PAGAMENTO)
            }));
    
            setTransacoes(transacoesFormatadas);
            setCarregando(false);
            setCheckboxStates(new Array(transacoesFormatadas.length).fill(false));
            atualizarTotal(transacoesFormatadas);
    
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            setCarregando(false);
            setAlert({ message: 'Erro ao buscar transações', type: 'error' });
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [location, insercaoFeita, termoBusca, contaId]);

    const isNotHome = location.pathname !== "/home";
    return (
        <div className={'container-lista'}>
            { isNotHome && (
                <Buttons transacoes={transacoes} tipoTransacao={location.pathname.includes('entradas') ? 'entrada' : 'saida'} />
              )
            }

            {!isNotHome ? (
            <h3>Todas as transações</h3>
            ) : (
            <h3>
                Transações de {location.pathname.includes('entradas') ? 'Entrada' : location.pathname.includes('saidas') ? 'Saída' : 'Pago'}
            </h3>
            )}
            <div className="pesquisa">
                <input 
                    type="text" 
                    placeholder="Digite aqui"  
                />
            </div>

            {alert.message && <Alert message={alert.message} type={alert.type} />}
            
            {carregando ? (
                <p className='message'>Carregando...</p>
            ) : transacoes.length === 0 ? (
                <p className='message'>{termoBusca ? 'Nenhum registro correspondente encontrado.' : 'Sem registros.'}</p>
            ) : (
                <ul>
                    {transacoes.map((transacao, index) => (
                        <li key={transacao.ID}>
                            <div>
                                <span className={Icones({ isPaid: transacao.isPaid, cs_tipo: transacao.CS_TIPO })}>
                                    {getIconForFormaPagamento(transacao.ID_FORMA_PAGAMENTO)}
                                </span>
                            </div>
                            <div className='content'>
                                <div className='titles'>
                                    <span className='titulo'>Descricao</span>
                                    <span className='titulo'>{transacao.CS_TIPO === "P" ? "Data pago" : "Data"}</span>
                                    <span className='titulo'>Valor</span>
                                </div>
                                <div className='content-values'>
                                        <span className="desc">{transacao.DESCRICAO}</span>
                                        <span className="data">{transacao.DATA}</span>
                                        <span className={location.pathname.includes('pagos') || transacao.CS_TIPO === "P" ? "text-saidas" : "valor-lista"}>
                                        {location.pathname.includes('pagos') || transacao.CS_TIPO === "P"
                                            ? `- R$ ${formatarValor(transacao.VALOR)}`
                                            : `R$ ${formatarValor(transacao.VALOR)}`
                                        }
                                        </span>
                                </div>
                            </div>
                            <div className='btn-list'>
                                <div>
                                {(location.pathname.includes('saidas') || transacao.CS_TIPO === "S") && (
                                <button
                                onClick={() => registrarPagamento(index)}
                                >
                                    <i className="fi fi-rs-registration-paper"></i>
                                </button>
                                )}
                                </div>
                                <button 
                                    onClick={() => excluirTransacao(index, location.pathname.includes('entradas') || transacao.CS_TIPO === "R" ? 'entrada' : 'saidas')}
                                >
                                    <i className="fi fi-rr-trash"></i>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
         {modalVisible && (
            <ModalPagamento 
                onConfirm={modalHandlers.onConfirm} 
                onClose={modalHandlers.onClose} 
            />
        )}
        </div>
    );
}

export default ListaTransacoes;
