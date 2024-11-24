import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user && !welcomeShown) {
      const lastLoginDate = localStorage.getItem('lastLoginDate');
      const today = new Date().toISOString().split('T')[0];

      if (lastLoginDate !== today) {
        setAlert({ message: `Seja bem-vindo(a), ${user.nm_usuario}!`, type: 'success' });
        localStorage.setItem('lastLoginDate', today);
        setWelcomeShown(true);
      } else {
        setWelcomeShown(true);
      }
    }
  }, [user, welcomeShown]);

  const login = ({ id_usuario, nm_usuario, email, id_conta }) => { 
    const user = { id_usuario, nm_usuario, email, id_conta }; 
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    const lastLoginDate = localStorage.getItem('lastLoginDate');
    const today = new Date().toISOString().split('T')[0];
    if (lastLoginDate !== today) {
      setAlert({ message: `Seja bem-vindo(a), ${user.nm_usuario}!`, type: 'success' });
      localStorage.setItem('lastLoginDate', today);
    }
    setWelcomeShown(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('lastLoginDate');
    setAlert({ message: '', type: '' });
    setWelcomeShown(false);  
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userId: user ? user.id_usuario : null, 
      contaId: user ? user.id_conta : null, 
      login, 
      logout, 
      alert, 
      setAlert 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
