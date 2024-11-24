import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Header({ onBuscar }) {
    const { logout, user } = useAuth(); 
    const navigate = useNavigate();
    const location = useLocation();
    const [valorBusca, setValorBusca] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        console.log("Current path:", location.pathname); 
    }, [location]);

    const handleBuscar = () => {
        onBuscar(valorBusca); 
    };

    const handleLogout = () => {
        logout();
        navigate('/'); 
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const isNotHome = location.pathname !== "/home";

    return (
        <div className="header">
             <div className={isNotHome ? "profile-container-left" : "profile-container"} onClick={toggleProfileMenu}>
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
