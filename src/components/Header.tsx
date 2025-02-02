import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
    isLoggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, setLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setLoggedIn(false);
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/');
    };

    return (
        <nav className="header">
            <div className="links-container">
                <Link to="/feed">Feed</Link>
                <Link to="/user">Profile</Link>
                <Link to="/search">Search</Link>
                <Link to="/search-photo">Search Photo</Link>
                <Link to="/posts">Posts</Link>
            </div>
            <button
                onClick={isLoggedIn ? handleLogout : handleLogin}
                className="logout-button"
            >
                {isLoggedIn ? 'Logout' : 'Login'}
            </button>
        </nav>
    );
};

export default Header;
