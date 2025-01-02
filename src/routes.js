import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FeedPage from './components/FeedPage';
import UserProfile from './components/UserProfile';
import SearchPage from './components/SearchPage';
import SearchPhotoPage from './components/SearchPhotoPage';
import PostsPage from './components/PostsPage';
import CreatePostPage from './components/CreatePostPage';
import UserDetails from './components/UserDetails';

const RoutesConfig = ({ setLoggedIn }) => (
    <Routes>
        <Route path="/" element={<LoginPage setLoggedIn={setLoggedIn} />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/user-details/:userId" element={<UserDetails />} /> { }
        <Route path="/search-photo" element={<SearchPhotoPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/create-post" element={<CreatePostPage />} /> {/* CreatePostPage */}
    </Routes>
);

export default RoutesConfig;
