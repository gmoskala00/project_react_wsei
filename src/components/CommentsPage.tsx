import React, { useEffect, useState } from 'react';
import { getComments, addComment, deleteComment, Comment } from '../services/api';

interface CommentsPageProps {
    postId: number;
}

const CommentsPage: React.FC<CommentsPageProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const loggedUser = localStorage.getItem('user');

    useEffect(() => {
        getComments(postId).then((response) => setComments(response.data));
    }, [postId]);

    const handleAddComment = () => {
        addComment({ postId, body: newComment, name: loggedUser || '' }).then((response) => {
            setComments([...comments, response.data]);
            setNewComment('');
        });
    };

    const handleDeleteComment = (commentId: number) => {
        deleteComment(commentId).then(() => {
            setComments(comments.filter((comment) => comment.id !== commentId));
        });
    };

    return (
        <div>
            <h3>Comments</h3>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Add Comment</button>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <p>{comment.body}</p>
                        {loggedUser === comment.name && (
                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentsPage;
