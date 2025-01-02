import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/api';

const SearchPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Stan ładowania

    useEffect(() => {
        getUsers().then((response) => {
            setUsers(response.data);
            setLoading(false); // Wyłącz ładowanie po pobraniu danych
        });
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <h1>User Search</h1>
            <input
                type="text"
                placeholder="Search users by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
            />
            {loading ? (
                <p style={styles.loading}>Loading...</p> // Labelka ładowania
            ) : (
                <ul style={styles.list}>
                    {filteredUsers.map((user) => (
                        <Link
                            to={`/user-details/${user.id}`}
                            key={user.id}
                            style={styles.linkContainer}
                        >
                            <li style={styles.listItem}>
                                <h3>{user.name}</h3>
                                <p>Email: {user.email}</p>
                                <p>Company: {user.company?.name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    input: {
        padding: '10px',
        marginBottom: '20px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    linkContainer: {
        textDecoration: 'none',
        color: 'inherit',
    },
    listItem: {
        marginBottom: '15px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#555',
    },
};

export default SearchPage;
