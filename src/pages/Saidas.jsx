import React, { useState } from 'react';
import ValorTotalSaida from "../componentes/ValorTotal/ValorTotalSaida";
import Header from "../componentes/Header/Header";
import ListaTransacoes from '../componentes/ListaTransacoes/ListaTransacoes';
import Add from '../componentes/Add/Add';

function Saidas() {
    const [insercaoFeita, setInsercaoFeita] = useState(false);
    const [totalSaidas, setTotalSaidas] = useState(0);
    const [termoBusca, setTermoBusca] = useState('');

    const atualizarTotalSaidas = (novoValor) => {
        setTotalSaidas(novoValor);
    }

    const pesquisarTransacao = (termo) => {
        setTermoBusca(termo);
    };

    return (
        <div>
            <Header onBuscar={pesquisarTransacao} />
            <div className='container-saidas'>
                <div className='box'>
                    <div className='inicio'>
                        <h1>Despesas</h1>
                        <Add onInsert={() => setInsercaoFeita(!insercaoFeita)} atualizarTotalSaidas={atualizarTotalSaidas} tipoTransacao="saida" />
                    </div>
                    <div className="total-saidas">
                        Total: <span className="valor">R$ <ValorTotalSaida totalSaidas={totalSaidas} atualizarTotalSaidas={atualizarTotalSaidas} /></span>
                    </div>
                    <ListaTransacoes insercaoFeita={insercaoFeita} termoBusca={termoBusca} atualizarTotalSaidas={atualizarTotalSaidas} />
                </div>
            </div>
        </div>
    );
}

export default Saidas;
