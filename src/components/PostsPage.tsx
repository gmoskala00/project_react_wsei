import React, { useEffect, useState } from 'react';
import {
    getPosts,
    getUsers,
    getComments,
    addComment,
    addPost,
    deletePost,
    Post,
    User,
    Comment
} from '../services/api';

const PostsPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
    const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
    const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);

    const [newPostTitle, setNewPostTitle] = useState<string>('');
    const [newPostBody, setNewPostBody] = useState<string>('');

    // Zalogowany użytkownik zapisany w localStorage (jako username)
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
            getComments(postId).then((response) => {
                setComments((prev) => ({ ...prev, [postId]: response.data }));
                setShowComments((prev) => ({ ...prev, [postId]: true }));
            });
        } else {
            setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
        }
    };

    const handleAddComment = (postId: number) => {
        if (!newComment[postId]) {
            alert('Proszę wpisać komentarz.');
            return;
        }

        const loggedInUser = users.find((user) => user.username === loggedUser);
        if (!loggedInUser) {
            alert('Nie znaleziono użytkownika!');
            return;
        }

        const commentData = {
            postId,
            body: newComment[postId],
            name: loggedInUser.name,
            email: `${loggedInUser.username}@example.com`,
        };

        if (!comments[postId]) {
            getComments(postId).then((response) => {
                const existingComments = response.data;
                addComment(commentData).then((newResponse) => {
                    setComments((prev) => ({
                        ...prev,
                        [postId]: [...existingComments, newResponse.data],
                    }));
                    setNewComment((prev) => ({ ...prev, [postId]: '' }));
                    setShowComments((prev) => ({ ...prev, [postId]: true }));
                });
            });
        } else {
            addComment(commentData).then((newResponse) => {
                setComments((prev) => ({
                    ...prev,
                    [postId]: [...prev[postId], newResponse.data],
                }));
                setNewComment((prev) => ({ ...prev, [postId]: '' }));
                setShowComments((prev) => ({ ...prev, [postId]: true }));
            });
        }
    };

    const handleCreatePost = () => {
        if (!newPostTitle || !newPostBody) {
            alert('Proszę wypełnić tytuł i treść posta.');
            return;
        }

        if (!loggedUser) {
            alert('Musisz być zalogowany, aby utworzyć post.');
            return;
        }

        const loggedInUser = users.find(user => user.username === loggedUser);
        if (!loggedInUser) {
            alert('Nie znaleziono danych użytkownika!');
            return;
        }

        const newPostData = {
            title: newPostTitle,
            body: newPostBody,
            userId: loggedInUser.id
        };

        addPost(newPostData).then((response) => {
            setPosts((prevPosts) => [response.data, ...prevPosts]);
            setNewPostTitle('');
            setNewPostBody('');
        });
    };

    // Usuwamy post tylko wtedy, gdy aktualnie zalogowany użytkownik jest autorem posta
    const handleDeletePost = (postId: number) => {
        deletePost(postId)
            .then(() => {
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            })
            .catch((error) => {
                console.error("Error deleting post: ", error);
            });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Posts</h1>

            {loggedUser && (
                <div style={styles.createPostContainer}>
                    <h2>Utwórz nowy post</h2>
                    <input
                        type="text"
                        placeholder="Tytuł"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Treść"
                        value={newPostBody}
                        onChange={(e) => setNewPostBody(e.target.value)}
                        style={styles.textarea}
                    />
                    <button onClick={handleCreatePost} style={styles.button}>
                        Utwórz post
                    </button>
                </div>
            )}

            <ul style={styles.postList}>
                {posts.map((post) => {
                    const postUser = users.find((user) => user.id === post.userId);
                    const isAuthor = postUser && loggedUser === postUser.username;

                    return (
                        <li key={post.id} style={styles.postItem}>
                            <h2>{post.title}</h2>
                            <p>{post.body}</p>
                            <p>Autor: {postUser ? postUser.name : 'Nieznany'}</p>

                            <div style={styles.buttonsRow}>
                                <button
                                    style={styles.button}
                                    onClick={() => handleFetchComments(post.id)}
                                >
                                    {showComments[post.id] ? 'Ukryj komentarze' : 'Pokaż komentarze'}
                                </button>
                                {isAuthor && (
                                    <button
                                        style={styles.deleteButton}
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Usuń post
                                    </button>
                                )}
                            </div>

                            {showComments[post.id] && (
                                <>
                                    <h3>Komentarze</h3>
                                    <ul style={styles.commentList}>
                                        {comments[post.id] && comments[post.id].length > 0 ? (
                                            comments[post.id].map((comment) => (
                                                <li key={comment.id} style={styles.commentItem}>
                                                    <p>{comment.body}</p>
                                                    <small>— {comment.name}</small>
                                                </li>
                                            ))
                                        ) : (
                                            <li style={styles.commentItem}><p>Brak komentarzy</p></li>
                                        )}
                                    </ul>
                                    {loggedUser && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Dodaj komentarz"
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
                                                Dodaj komentarz
                                            </button>
                                        </div>
                                    )}
                                </>
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
    buttonsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
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
    textarea: {
        padding: '8px',
        marginTop: '10px',
        width: '100%',
        height: '100px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    createPostContainer: {
        marginBottom: '40px',
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
};

export default PostsPage;
