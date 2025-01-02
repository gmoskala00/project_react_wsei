import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getUsers, getComments, deletePost, addComment, deleteComment } from '../services/api';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({});
    const loggedUser = localStorage.getItem('user'); // Pobierz nazwę zalogowanego użytkownika
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getPosts(), getUsers(), getComments()]).then(
            ([postsResponse, usersResponse, commentsResponse]) => {
                setPosts(postsResponse.data);
                setUsers(usersResponse.data);
                setComments(commentsResponse.data);
                setLoading(false);
            }
        );
    }, []);

    const handleDeletePost = (postId) => {
        const userId = users.find((u) => u.username === loggedUser)?.id;
        const post = posts.find((p) => p.id === postId);

        if (post.userId !== userId) {
            alert('You can only delete your own posts!');
            return;
        }

        deletePost(postId).then(() => {
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        });
    };

    const handleAddComment = (postId) => {
        if (!newComment[postId]) {
            alert('Please enter a comment.');
            return;
        }

        // Pobierz dane aktualnie zalogowanego użytkownika
        const user = users.find((u) => u.username === loggedUser);
        if (!user) {
            alert('You must be logged in to add comments.');
            return;
        }

        const { name, email } = user; // Wyciągnij `name` i `email` użytkownika
        addComment({
            body: newComment[postId],
            postId, // ID posta, do którego dodawany jest komentarz
            name,  // Imię zalogowanego użytkownika
            email, // Email zalogowanego użytkownika
        }).then((response) => {
            setComments((prev) => [...prev, response.data]);
            setNewComment((prev) => ({ ...prev, [postId]: '' })); // Wyczyść pole
        });
    };

    const handleDeleteComment = (commentId) => {
        const userId = users.find((u) => u.username === loggedUser)?.id;
        const comment = comments.find((c) => c.id === commentId);

        if (comment.userId !== userId) {
            alert('You can only delete your own comments!');
            return;
        }

        deleteComment(commentId).then(() => {
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Posts</h1>
            <button
                onClick={() => navigate('/create-post')}
                style={{
                    marginBottom: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Create Post
            </button>
            <ul>
                {posts.map((post) => {
                    const user = users.find((u) => u.id === post.userId);
                    const postComments = comments.filter((c) => c.postId === post.id);

                    return (
                        <li key={post.id} style={styles.postItem}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                            <p>
                                Posted by: <strong>{user ? user.name : 'Unknown User'}</strong>
                            </p>
                            {loggedUser && users.find((u) => u.username === loggedUser)?.id === post.userId && (
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeletePost(post.id)}
                                >
                                    Delete Post
                                </button>
                            )}
                            <h4>Comments</h4>
                            <ul>
                                {postComments.map((comment) => (
                                    <li key={comment.id}>
                                        <p>{comment.body}</p>
                                        {loggedUser &&
                                            users.find((u) => u.username === loggedUser)?.id === comment.userId && (
                                                <button
                                                    style={styles.deleteCommentButton}
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete Comment
                                                </button>
                                            )}
                                    </li>
                                ))}
                            </ul>
                            {loggedUser && (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={newComment[post.id] || ''}
                                        onChange={(e) =>
                                            setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                                        }
                                        style={styles.commentInput}
                                    />
                                    <button
                                        style={styles.addCommentButton}
                                        onClick={() => handleAddComment(post.id)}
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

const styles = {
    postItem: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteCommentButton: {
        padding: '3px 8px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    commentInput: {
        padding: '8px',
        marginRight: '10px',
        width: '80%',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    addCommentButton: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default PostsPage;
