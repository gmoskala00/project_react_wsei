import React, { useEffect, useState } from 'react';
import { getPhotos, getUsers, getAlbums, addPhoto, deletePhoto, Photo, User, Album } from '../services/api';

const FeedPage: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [newPhoto, setNewPhoto] = useState<string>('');
    const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        Promise.all([getPhotos(), getUsers(), getAlbums()]).then(
            ([photosResponse, usersResponse, albumsResponse]) => {
                setPhotos(photosResponse.data);
                setUsers(usersResponse.data);
                setAlbums(albumsResponse.data); // Load albums
                setLoading(false);
            }
        );
    }, []);

    // Filter photos based on selected user
    const filteredPhotos = photos.filter((photo) => {
        if (selectedUser) {
            const userAlbums = albums.filter(
                (album) => album.userId === users.find((user) => user.username === selectedUser)?.id
            );
            return userAlbums.some((album) => album.id === photo.albumId);
        }
        return true;
    });

    const handleAddPhoto = () => {
        if (!newPhoto || !newPhotoTitle) {
            alert('Please enter a photo URL and title.');
            return;
        }

        const userId = users.find((user) => user.username === loggedUser)?.id;
        if (!userId) {
            alert('User not found!');
            return;
        }

        addPhoto({ title: newPhotoTitle, url: newPhoto, albumId: userId }).then((response) => {
            setPhotos((prev) => [...prev, response.data]);
            setNewPhoto('');
            setNewPhotoTitle('');
        });
    };

    const handleDeletePhoto = (photoId: number) => {
        // Get the logged-in user
        const loggedInUser = users.find((user) => user.username === loggedUser);

        if (!loggedInUser) {
            alert('User not found!');
            return;
        }

        // Find the photo to delete
        const photo = photos.find((photo) => photo.id === photoId);

        if (!photo) {
            alert('Photo not found!');
            return;
        }

        const albumOwner = users.find(
            (user) => user.id === albums.find((album) => album.id === photo.albumId)?.userId
        );

        if (!albumOwner || albumOwner.id !== loggedInUser.id) {
            alert('You can only delete photos from your own albums!');
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

            {loggedUser && (
                <>
                    <input
                        type="text"
                        placeholder="Photo Title"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        style={styles.input}
                    />
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

            <ul style={styles.photoList}>
                {filteredPhotos.map((photo) => (
                    <li key={photo.id} style={styles.photoItem}>
                        <img src={photo.url} alt={photo.title} style={styles.photo} />
                        <p>{photo.title}</p>
                        {loggedUser &&
                            users.find((user) => user.username === loggedUser)?.id ===
                            albums.find((album) => album.id === photo.albumId)?.userId && (
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

const styles: { [key: string]: React.CSSProperties } = {
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
