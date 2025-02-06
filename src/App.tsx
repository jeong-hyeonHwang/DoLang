import { Routes, Route } from 'react-router';
import Layout from './shared/Layout';
import MainPage from './app/routes/MainView';
import FeedView from './app/routes/FeedView';
import SavedContentsView from './app/routes/SavedContentsView';
import VoiceCallView from './app/routes/VoiceCallView';
import UserProfileView from './app/routes/UserProfileView';
import { GlobalStyle } from './shared/globalStyle';
import React from 'react';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="feed" element={<FeedView />} />
          <Route path="savedContents" element={<SavedContentsView />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="/call" element={<VoiceCallView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
