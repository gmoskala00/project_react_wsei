import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../services/api';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();

    const loggedUser = localStorage.getItem('user'); // Pobierz nazwę użytkownika z localStorage

    const handleCreatePost = () => {
        if (!title || !body) {
            alert('Please fill in both the title and body.');
            return;
        }

        if (!loggedUser) {
            alert('You must be logged in to create a post.');
            navigate('/');
            return;
        }

        addPost({ title, body, username: loggedUser }).then(() => {
            navigate('/posts'); // Przekieruj na stronę postów po utworzeniu
        });
    };

    return (
        <div style={styles.container}>
            <h1>Create Post</h1>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
            />
            <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={styles.textarea}
            />
            <button onClick={handleCreatePost} style={styles.button}>
                Create Post
            </button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
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
    textarea: {
        padding: '10px',
        marginBottom: '10px',
        width: '100%',
        height: '100px',
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

export default CreatePostPage;
