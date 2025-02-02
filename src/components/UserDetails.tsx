import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getUsers,
    getPosts,
    getPhotos,
    getAlbums,
    User,
    Post,
    Photo,
    // Możesz dodać typ Album, jeśli go zdefiniowałeś w api.ts
} from '../services/api';

const UserDetails: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [albums, setAlbums] = useState<any[]>([]); // Jeśli masz interfejs Album, możesz użyć: useState<Album[]>([])

    useEffect(() => {
        if (userId) {
            const userIdNum = parseInt(userId, 10);

            // Pobranie danych użytkownika
            getUsers().then((response) => {
                const currentUser = response.data.find((u) => u.id === userIdNum);
                setUser(currentUser || null);
            });

            // Pobranie postów użytkownika
            getPosts().then((response) => {
                setPosts(response.data.filter((post) => post.userId === userIdNum));
            });

            // Pobranie albumów użytkownika, a następnie zdjęć z tych albumów
            getAlbums().then((response) => {
                const userAlbums = response.data.filter((album) => album.userId === userIdNum);
                setAlbums(userAlbums);

                getPhotos().then((photosResponse) => {
                    const userPhotos = photosResponse.data.filter((photo: Photo) =>
                        userAlbums.some((album: any) => album.id === photo.albumId)
                    );
                    setPhotos(userPhotos);
                });
            });
        }
    }, [userId]);

    if (!user) return <p>Loading...</p>;

    return (
        <div style={styles.container}>
            <h1>{user.name}'s Profile</h1>
            <h2>Details</h2>
            <ul style={styles.details}>
                <li>
                    <strong>Login:</strong> {user.username}
                </li>
                <li>
                    <strong>Email:</strong> {user.email}
                </li>
                <li>
                    <strong>Phone:</strong> {user.phone}
                </li>
                <li>
                    <strong>Website:</strong> {user.website}
                </li>
                <li>
                    <strong>Address:</strong> {user.address?.street}, {user.address?.city}
                </li>
                <li>
                    <strong>Company:</strong> {user.company?.name}
                </li>
            </ul>

            <h2>Posts</h2>
            <ul style={styles.list}>
                {posts.map((post) => (
                    <li key={post.id} style={styles.listItem}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>

            <h2>Photos</h2>
            <ul style={styles.photoList}>
                {photos.map((photo) => (
                    <li key={photo.id} style={styles.photoItem}>
                        <img src={photo.url} alt={photo.title} style={styles.photo} />
                        <p>{photo.title}</p>
                    </li>
                ))}
            </ul>
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

export default UserDetails;
