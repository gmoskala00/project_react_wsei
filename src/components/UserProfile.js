import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Do przekierowania niezalogowanych użytkowników
import { getUsers, getPosts, getPhotos } from '../services/api';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingPhotos, setLoadingPhotos] = useState(true);
    const navigate = useNavigate();

    // Pobierz zalogowanego użytkownika
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        if (!loggedUser) {
            navigate('/'); // Przekieruj na stronę logowania, jeśli użytkownik nie jest zalogowany
            return;
        }

        // Pobierz dane użytkownika
        getUsers().then((response) => {
            const currentUser = response.data.find((u) => u.username === loggedUser);
            setUser(currentUser);
        });
    }, [loggedUser, navigate]);

    useEffect(() => {
        if (user?.id) {
            // Pobierz posty użytkownika
            getPosts()
                .then((response) => {
                    setPosts(response.data.filter((post) => post.userId === user.id));
                })
                .finally(() => setLoadingPosts(false)); // Wyłącz wskaźnik ładowania postów

            // Pobierz zdjęcia użytkownika
            getPhotos()
                .then((response) => {
                    setPhotos(response.data.filter((photo) => photo.albumId === user.id));
                })
                .finally(() => setLoadingPhotos(false)); // Wyłącz wskaźnik ładowania zdjęć
        }
    }, [user?.id]);

    if (!user) return <p>Loading user data...</p>;

    return (
        <div style={styles.container}>
            <h1>Welcome, {user.name}</h1>
            <h2>Your Details</h2>
            <ul style={styles.details}>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Phone:</strong> {user.phone}</li>
                <li><strong>Website:</strong> {user.website}</li>
                <li><strong>Address:</strong> {user.address?.street}, {user.address?.city}</li>
                <li><strong>Company:</strong> {user.company?.name}</li>
            </ul>

            <h2>Your Posts</h2>
            {loadingPosts ? (
                <p>Loading posts...</p> // Wskaźnik ładowania postów
            ) : (
                <ul style={styles.list}>
                    {posts.map((post) => (
                        <li key={post.id} style={styles.listItem}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Your Photos</h2>
            {loadingPhotos ? (
                <p>Loading photos...</p> // Wskaźnik ładowania zdjęć
            ) : (
                <ul style={styles.photoList}>
                    {photos.map((photo) => (
                        <li key={photo.id} style={styles.photoItem}>
                            <img src={photo.url} alt={photo.title} style={styles.photo} />
                            <p>{photo.title}</p>
                        </li>
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
    details: {
        listStyleType: 'none',
        padding: 0,
        marginBottom: '20px',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    photoList: {
        listStyleType: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
    },
    photoItem: {
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
    },
    photo: {
        width: '100%',
        borderRadius: '5px',
    },
};

export default UserProfile;
