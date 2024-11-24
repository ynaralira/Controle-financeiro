import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../componentes/AuthContext';
import Alert from '../componentes/Alert/Alert';

const Login = () => {
  const { login, setAlert, alert } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === '' || password.trim() === '') {
      setAlert({ message: 'Email e senha são campos obrigatórios.', type: 'error' });
      return;
    }

    if (!validateEmail(email)) {
      setAlert({ message: 'Por favor, insira um email válido.', type: 'error' });
      return;
    }

    if (password.length < 4) {
      setAlert({ message: 'A senha deve ter no mínimo 4 dígitos.', type: 'error' });
      return;
    }

    try {
      
      const response = await fetch('http://localhost/Controle-financeiro/back-end/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();

      if (result.success) {
        const { id_usuario, nm_usuario, email, id_conta } = result; 
        login({ id_usuario, nm_usuario, email, id_conta });
        navigate('/home');
      } else {
        setAlert({ message: 'Email ou senha incorretos', type: 'error' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setAlert({ message: 'Ocorreu um erro. Tente novamente mais tarde.', type: 'error' });
    }
  };

  return (
    <div className='container-login'>
      <form onSubmit={handleSubmit}>
      <h1>Lo-gin</h1>
      <div className='label'>
        <label htmlFor="email">E-mail</label>
      </div>
        <input
          type="text"
          placeholder='Digite seu e-mail'
          value={email}
          name='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='label'>
          <label htmlFor="password">Senha</label>
        </div>
        <input
          type="password"
          placeholder='Digite sua senha'
          value={password}
          name='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Acessar" />
      </form>
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />} {/* Display Alert */}
    </div>
  );
};

export default Login;
