import React from 'react';
import { Routes, Route } from 'react-router';
import Layout from './shared/Layout';
import MainPage from './app/routes/MainView';
import FeedView from './app/routes/FeedView';
import SavedContentsView from './app/routes/SavedContentsView';
import UserProfileView from './app/routes/UserProfileView';
import GoogleLoginView from './features/Auth/GoogleLoginView';
import GoogleSignupView from './features/Auth/GoogleSignUpView';
import { GlobalStyle } from './shared/globalStyle';

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

          {/* Auth */}
          <Route path="oauth2" element={<GoogleLoginView />} />
          <Route path="oauth2/code" element={<GoogleLoginView />} />
          <Route path="/signup" element={<GoogleSignupView />} />

          {/* savedContetns */}
          <Route path="savedContents/bookmark" element={<>북마크</>} />
          <Route path="savedContents/calls" element={<>call</>} />
          <Route path="savedContents/feed" element={<>feed</>} />

          {/* User */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
