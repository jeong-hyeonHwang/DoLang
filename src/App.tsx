import React from 'react';
import { Routes, Route } from 'react-router';
import { NavBarContainer } from './shared/components/NavBar/NavBarContainer';
import MainView from './app/routes/MainView';
import FeedView from './app/routes/FeedView';
import SavedContentsView from './app/routes/SavedContentsView';
import UserProfileView from './app/routes/UserProfileView';
import './App.css';

function App() {
  return (
    <>
      <NavBarContainer />
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/feed" element={<FeedView />} />
        <Route path="/savedContents" element={<SavedContentsView />} />
        <Route path="/profile" element={<UserProfileView />} />
      </Routes>
    </>
  );
}

export default App;
