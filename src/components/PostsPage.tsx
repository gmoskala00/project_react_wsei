import React, { useEffect, useState } from 'react';
import { getPosts, getUsers, getComments, addComment, Post, User, Comment } from '../services/api';

const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
    const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        Promise.all([getPosts(), getUsers()]).then(([postsResponse, usersResponse]) => {
            setPosts(postsResponse.data);
            setUsers(usersResponse.data);
            setLoading(false);
        });
    }, []);

    const handleFetchComments = (postId: number) => {
        if (!comments[postId]) {
            // Pobierz komentarze, jeśli ich jeszcze nie ma
            getComments(postId).then((response) => {
                setComments((prev) => ({ ...prev, [postId]: response.data }));
                setShowComments((prev) => ({ ...prev, [postId]: true })); // Ustaw widoczność komentarzy
            });
        } else {
            // Przełącz widoczność komentarzy
            setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
        }
    };

    const handleAddComment = (postId: number) => {
        if (!newComment[postId]) {
            alert('Please enter a comment.');
            return;
        }

        const loggedInUser = users.find((user) => user.username === loggedUser);
        if (!loggedInUser) {
            alert('User not found!');
            return;
        }

        addComment({
            postId,
            body: newComment[postId],
            name: loggedInUser.name,
            email: `${loggedInUser.username}@example.com`,
        }).then((response) => {
            // Dodaj nowy komentarz do stanu
            setComments((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] || []), response.data], // Połącz nowe i istniejące komentarze
            }));
            setNewComment((prev) => ({ ...prev, [postId]: '' })); // Wyczyść pole komentarza
            setShowComments((prev) => ({ ...prev, [postId]: true })); // Upewnij się, że komentarze są widoczne
        });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Posts</h1>
            <ul style={styles.postList}>
                {posts.map((post) => {
                    const postUser = users.find((user) => user.id === post.userId);

                    return (
                        <li key={post.id} style={styles.postItem}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                            <p>Posted by: {postUser?.name || 'Unknown'}</p>

                            <button
                                style={styles.button}
                                onClick={() => handleFetchComments(post.id)}
                            >
                                {showComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                            </button>

                            {showComments[post.id] && comments[post.id] && (
                                <>
                                    <h3>Comments</h3>
                                    <ul style={styles.commentList}>
                                        {comments[post.id].map((comment) => (
                                            <li key={comment.id} style={styles.commentItem}>
                                                <p>{comment.body}</p>
                                                <small>— {comment.name}</small>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {loggedUser && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={newComment[post.id] || ''}
                                        onChange={(e) =>
                                            setNewComment((prev) => ({
                                                ...prev,
                                                [post.id]: e.target.value,
                                            }))
                                        }
                                        style={styles.input}
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        style={styles.button}
                                    >
                                        Add Comment
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    postList: {
        listStyleType: 'none',
        padding: 0,
    },
    postItem: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    commentList: {
        listStyleType: 'none',
        padding: '10px 0',
    },
    commentItem: {
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
    },
    input: {
        padding: '8px',
        marginTop: '10px',
        width: '100%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        marginTop: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default PostsPage;
