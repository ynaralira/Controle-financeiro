import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const ValorTotalSaida = ({ totalSaidas, atualizarTotalSaidas }) => {
    const [somaSaidas, setSomaSaidas] = useState(totalSaidas);
    const location = useLocation();
    const { userId } = useAuth(); 

    useEffect(() => {
        if (location.pathname === '/home' && userId) {
            const fetchData = async () => {
                try {
                    const response = await fetch("../../../php/index.php", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id_usuario: userId }), 
                    });

                    const data = await response.json();

                    const valoresSaidas = data.valor_saida.map(item => parseFloat(item.valor));
                    const somaSaidas = valoresSaidas.reduce((total, valor) => total + valor, 0);
                    setSomaSaidas(somaSaidas);
                    atualizarTotalSaidas(somaSaidas);
                } catch (error) {
                    console.error('Erro ao buscar os valores de saídas:', error);
                }
            };

            fetchData();
        } else {
            setSomaSaidas(totalSaidas);
            atualizarTotalSaidas(totalSaidas); 
        }
    }, [location.pathname, atualizarTotalSaidas, totalSaidas, userId]);

    const formatNumber = (number) => {
        if (number === undefined || number === null || isNaN(number)) {
            return '0,00';
        }
        return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <span>{formatNumber(somaSaidas)}</span>
    );
};

export default ValorTotalSaida;
