import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getPosts, getPhotos, getAlbums, User, Post, Photo, Album } from '../services/api';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
    const [loadingPhotos, setLoadingPhotos] = useState<boolean>(true);
    const navigate = useNavigate();

    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        if (!loggedUser) {
            navigate('/');
            return;
        }

        getUsers().then((response) => {
            const currentUser = response.data.find((u) => u.username === loggedUser);
            setUser(currentUser || null);
        });
    }, [loggedUser, navigate]);

    useEffect(() => {
        if (user?.id) {
            // Pobierz posty użytkownika
            getPosts()
                .then((response) => {
                    setPosts(response.data.filter((post) => post.userId === user.id));
                })
                .finally(() => setLoadingPosts(false));

            // Pobierz albumy użytkownika i zdjęcia
            getAlbums()
                .then((response) => {
                    const userAlbums = response.data.filter((album) => album.userId === user.id);
                    setAlbums(userAlbums); // Ustaw albumy użytkownika

                    // Pobierz zdjęcia z tych albumów
                    return getPhotos().then((response) => {
                        const userPhotos = response.data.filter((photo) =>
                            userAlbums.some((album) => album.id === photo.albumId)
                        );
                        setPhotos(userPhotos);
                    });
                })
                .finally(() => setLoadingPhotos(false));
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
                <p>Loading posts...</p>
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
                <p>Loading photos...</p>
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

const styles: { [key: string]: React.CSSProperties } = {
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
