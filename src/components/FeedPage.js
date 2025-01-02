import React, { useEffect, useState } from 'react';
import { getPhotos, getUsers, addPhoto, deletePhoto } from '../services/api';

const FeedPage = () => {
    const [photos, setPhotos] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [newPhoto, setNewPhoto] = useState('');
    const [loading, setLoading] = useState(true);
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        Promise.all([getPhotos(), getUsers()])
            .then(([photosResponse, usersResponse]) => {
                setPhotos(photosResponse.data);
                setUsers(usersResponse.data);
                setLoading(false); // Wyłącz ładowanie po zakończeniu pobierania danych
            });
    }, []);

    const filteredPhotos = photos.filter((photo) => {
        if (selectedUser) {
            return users.find((user) => user.id === photo.albumId && user.username === selectedUser);
        }
        return true;
    });

    const handleAddPhoto = () => {
        if (!newPhoto) {
            alert('Please enter a photo URL');
            return;
        }
        const userId = users.find((user) => user.username === loggedUser)?.id;
        if (!userId) {
            alert('User not found!');
            return;
        }

        addPhoto({ title: 'New Photo', url: newPhoto, albumId: userId }).then(() => {
            setPhotos((prev) => [...prev, { title: 'New Photo', url: newPhoto, albumId: userId }]);
            setNewPhoto('');
        });
    };

    const handleDeletePhoto = (photoId) => {
        const userId = users.find((user) => user.username === loggedUser)?.id;
        const photo = photos.find((photo) => photo.id === photoId);

        if (photo.albumId !== userId) {
            alert('You can only delete your own photos!');
            return;
        }

        deletePhoto(photoId).then(() => {
            setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
        });
    };

    if (loading) return <p style={styles.loading}>Loading...</p>;

    return (
        <div>
            <h1>Feed</h1>
            {/* Filtrowanie po użytkowniku */}
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                style={styles.select}
            >
                <option value="">All Users</option>
                {users.map((user) => (
                    <option key={user.id} value={user.username}>
                        {user.name}
                    </option>
                ))}
            </select>

            {/* Dodawanie zdjęcia */}
            {loggedUser && (
                <>
                    <input
                        type="text"
                        placeholder="New Photo URL"
                        value={newPhoto}
                        onChange={(e) => setNewPhoto(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleAddPhoto} style={styles.button}>
                        Add Photo
                    </button>
                </>
            )}

            {/* Wyświetlanie zdjęć */}
            <ul style={styles.photoList}>
                {filteredPhotos.map((photo) => (
                    <li key={photo.id} style={styles.photoItem}>
                        <img src={photo.url} alt={photo.title} style={styles.photo} />
                        <p>{photo.title}</p>
                        {loggedUser && users.find((user) => user.username === loggedUser)?.id === photo.albumId && (
                            <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                style={styles.deleteButton}
                            >
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    select: {
        padding: '10px',
        margin: '10px 5px',
        borderRadius: '5px',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        width: '200px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '5px',
    },
    photoList: {
        listStyleType: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
    },
    photoItem: {
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
    },
    photo: {
        width: '100%',
        borderRadius: '5px',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#555',
    },
};

export default FeedPage;
