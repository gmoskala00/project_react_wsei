import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setLoggedIn }) => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            navigate('/feed'); // Jeśli użytkownik jest zalogowany, przekieruj na stronę feedu
        }
    }, [navigate]);

    const handleLogin = () => {
        if (username) {
            localStorage.setItem('user', username); // Zapisz użytkownika w localStorage
            setLoggedIn(true); // Ustaw stan zalogowania
            navigate('/feed'); // Przekieruj na stronę feedu
        } else {
            alert('Please enter a username.');
        }
    };

    return (
        <div style={styles.container}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>
                Login
            </button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    input: {
        padding: '10px',
        marginBottom: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default LoginPage;
