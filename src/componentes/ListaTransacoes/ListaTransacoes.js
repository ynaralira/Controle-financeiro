import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Buttons from '../Buttons';
import Icone from '../Icones';
import { useAuth } from '../AuthContext';
import Alert from '../Alert/Alert'; 
import './ListaTransacoes.css';

function ListaTransacoes({ insercaoFeita, termoBusca, atualizarTotalSaidas }) {
    const [transacoes, setTransacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [checkboxStates, setCheckboxStates] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' }); 
    const location = useLocation();
    const { userId } = useAuth(); 

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

            if (location.pathname.includes('saidas')) {
                const exclusaoSucesso = await excluirEntradaCorrespondente(valorTransacao);
                if (!exclusaoSucesso) {
                    return;
                }
            }

            const response = await fetch("/registrar_pagamento.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: transacao.ID,
                    id_usuario: userId
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
            const response = await fetch("/excluir_entrada_correspondente.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    valor: valorTransacao,
                    id_usuario: userId 
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
            const response = await fetch("/excluir_transacao.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: transacao.ID,
                    tipo: tipoTransacao,
                    id_usuario: userId 
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
                setAlert({ message: result.message, type: 'success' });
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
            const response = await fetch("/lista_transacoes.php", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: userId 
                }),
            });
            const data = await response.json();

            let transacoesLista = [];
            const tipoTransacao = location.pathname.includes('entradas') ? 'entrada' : location.pathname.includes('saidas') ? 'saida' : 'pago';

            switch (tipoTransacao) {
                case 'entrada':
                    transacoesLista = data.transacao_entrada;
                    break;
                case 'saida':
                    transacoesLista = data.transacao_saida;
                    break;
                case 'pago':
                    transacoesLista = data.transacao_pagos;
                    break;
                default:
                    console.error('Tipo de transação inválido:', tipoTransacao);
                    break;
            }

            const transacoesFiltradas = transacoesLista.filter(transacao => 
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
    }, [location, insercaoFeita, termoBusca, userId]);

    return (
        <div className="container-lista">
            <Buttons transacoes={transacoes} tipoTransacao={location.pathname.includes('entradas') ? 'entrada' : 'saida'} />
            <h3>Transações de {location.pathname.includes('entradas') ? 'Entrada' : location.pathname.includes('saidas') ? 'Saída' : 'Pago'}</h3>
            
            {alert.message && <Alert message={alert.message} type={alert.type} />}
            
            {carregando ? (
                <p className='message'>Carregando...</p>
            ) : transacoes.length === 0 ? (
                <p className='message'>{termoBusca ? 'Nenhum registro correspondente encontrado.' : 'Sem registros.'}</p>
            ) : (
                <ul>
                    {transacoes.map((transacao, index) => (
                        <li key={transacao.ID}>
                            {location.pathname.includes('saidas') && (
                                <input
                                    type='checkbox'
                                    checked={checkboxStates[index] || false}
                                    onChange={() => registrarPagamento(index)}
                                />
                            )}

                            <span className={Icone({ isPaid: transacao.isPaid })}>
                                {getIconForFormaPagamento(transacao.ID_FORMA_PAGAMENTO)}
                            </span>
                            <span className="titulo">{transacao.DESCRICAO}</span>
                            <div className='data-valor'>
                                <span className="data">{transacao.DATA}</span>
                                <span className="valor-lista">R$ {formatarValor(transacao.VALOR)}</span>
                            </div>
                            <button 
                                className="btn-excluir"
                                onClick={() => excluirTransacao(index, location.pathname.includes('entradas') ? 'entrada' : 'saidas')}
                            >
                                <i className="fi fi-rr-trash"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaTransacoes;
