import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header({ onBuscar }) {
    const { logout, user } = useAuth(); 
    const navigate = useNavigate();
    const [valorBusca, setValorBusca] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleBuscar = () => {
        console.log("Termo de busca:", valorBusca); 
        onBuscar(valorBusca); 
    };

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <div className="header">
            <Link to="/home" className="menu">
                <i className="fi fi-br-menu-burger"></i>
            </Link>
            <div className="pesquisa">
                <input 
                    type="text" 
                    placeholder="Digite aqui" 
                    value={valorBusca} 
                    onChange={(e) => setValorBusca(e.target.value)} 
                />
            </div>
            <div className="profile-container" onClick={toggleProfileMenu}>
                <i className="fi fi-br-user"></i>
                {user && <div className="profile-name">{user.nm_usuario}</div>}
            </div>
            {showProfileMenu && (
                <div className="profile-menu">
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            )}
        </div>
    );
}

export default Header;
