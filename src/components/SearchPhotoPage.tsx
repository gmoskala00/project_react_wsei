import React, { useState, useEffect } from 'react';
import { getPhotos, Photo } from '../services/api';

const SearchPhotoPage: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [photoId, setPhotoId] = useState<string>('');
    const [albumId, setAlbumId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getPhotos()
            .then((response) => {
                setPhotos(response.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false); // Even if there's an error, disable loading state
            });
    }, []);

    const filteredPhotos = photos.filter((photo) => {
        return (
            (photoId ? photo.id === parseInt(photoId) : true) &&
            (albumId ? photo.albumId === parseInt(albumId) : true)
        );
    });

    return (
        <div style={styles.container}>
            <h1>Search Photos</h1>
            <input
                type="number"
                placeholder="Search by Photo ID"
                value={photoId}
                onChange={(e) => setPhotoId(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Search by Album ID"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                style={styles.input}
            />
            {loading ? (
                <p style={styles.loading}>Loading...</p>
            ) : (
                <ul style={styles.photoList}>
                    {filteredPhotos.map((photo) => (
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
    input: {
        padding: '10px',
        marginBottom: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
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
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#555',
    },
};

export default SearchPhotoPage;
