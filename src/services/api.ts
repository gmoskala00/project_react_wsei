import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        city: string;
    };
    phone: string;
    website: string;
    company: {
        name: string;
    };
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface Photo {
    id: number;
    albumId: number;
    title: string;
    url: string;
    thumbnailUrl?: string;
}

export interface Album {
    userId: number;
    id: number;
    title: string;
}

export interface Comment {
    id: number;
    postId: number;
    body: string;
    name: string;
    email: string;
}

export interface CreatePostPayload {
    title: string;
    body: string;
    userId: number;
}


export const getUsers = () => axios.get<User[]>(`${API_URL}/users`);
export const getPosts = () => axios.get<Post[]>(`${API_URL}/posts`);
export const getPhotos = () => axios.get<Photo[]>(`${API_URL}/photos`);
export const getAlbums = (): Promise<{ data: Album[] }> => axios.get(`${API_URL}/albums`);
export const getComments = (postId: number) =>
    axios.get<Comment[]>(`${API_URL}/comments?postId=${postId}`);
export const addPost = (data: CreatePostPayload) => axios.post<Post>(`${API_URL}/posts`, data);
export const deletePost = (id: number) => axios.delete(`${API_URL}/posts/${id}`);
export const addPhoto = (data: Partial<Photo>) =>
    axios.post<Photo>(`${API_URL}/photos`, data);
export const deletePhoto = (id: number) => axios.delete(`${API_URL}/photos/${id}`);
export const addComment = (comment: Partial<Comment>) =>
    axios.post<Comment>(`${API_URL}/comments`, comment);
export const deleteComment = (commentId: number) =>
    axios.delete(`${API_URL}/comments/${commentId}`);
