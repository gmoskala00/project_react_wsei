import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const getUsers = () => axios.get(`${API_URL}/users`);
export const getPosts = () => axios.get(`${API_URL}/posts`);
export const getPhotos = () => axios.get(`${API_URL}/photos`);
export const getComments = (postId) => axios.get(`${API_URL}/comments?postId=${postId}`);
export const addPost = (data) => axios.post(`${API_URL}/posts`, data);
export const deletePost = (id) => axios.delete(`${API_URL}/posts/${id}`);
export const addPhoto = (data) => axios.post(`${API_URL}/photos`, data);
export const deletePhoto = (id) => axios.delete(`${API_URL}/photos/${id}`);
export const addComment = (comment) => axios.post(`/comments`, comment);
export const deleteComment = (commentId) => axios.delete(`/comments/${commentId}`);

