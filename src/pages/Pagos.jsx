import React, { useState } from 'react';
import Sidebar from '../componentes/Sidebar/Sidebar';
import Header from '../componentes/Header/Header';
import ValorTotalPago from '../componentes/ValorTotal/ValorTotalPago';
import ListaTransacoes from '../componentes/ListaTransacoes/ListaTransacoes';
import Add from '../componentes/Add/Add';

function Pagos() {
    const [insercaoFeita, setInsercaoFeita] = useState(false);
    const [totalPagos, setTotalPagos] = useState(0);
    const [termoBusca, setTermoBusca] = useState('');

    const atualizarTotalPagos = (novoTotal) => {
        setTotalPagos(novoTotal);
    };

    const pesquisarTransacao = (termo) => {
        setTermoBusca(termo);
    };

    const handleInsercaoFeita = () => {
        setInsercaoFeita(!insercaoFeita);
        alert('Pagamento registrado como pago');
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content container-principal">
                <Header onBuscar={pesquisarTransacao} />
                <div className='container-pagos'>
                    <div className='box'>
                        <div className='inicio'>
                            <h1>Despesas pagas</h1>
                            <Add 
                                onInsert={handleInsercaoFeita} 
                                atualizarTotalPagos={atualizarTotalPagos} 
                                tipoTransacao="pago" 
                            />
                        </div>
                        <div className="total-pagos">
                            Total: <span className="valor">R$ <ValorTotalPago totalPagos={totalPagos} atualizarTotalPagos={atualizarTotalPagos} /></span>
                        </div>
                        <ListaTransacoes 
                            insercaoFeita={insercaoFeita} 
                            termoBusca={termoBusca} 
                            atualizarTotalSaidas={atualizarTotalPagos} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pagos;
