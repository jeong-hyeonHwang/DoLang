import React from 'react';
import { Routes, Route } from 'react-router';
import Layout from './shared/Layout.tsx';
import MainPage from './app/routes/MainView.tsx';
import FeedView from './app/routes/FeedView.tsx';
import SavedContentsView from './app/routes/SavedContentsView.tsx';
import VoiceCallView from './app/routes/VoiceCallView.tsx';
import UserProfileView from './app/routes/UserProfileView.tsx';
import GoogleLoginView from './features/Auth/GoogleLoginView.tsx';
import GoogleSignupView from './features/Auth/GoogleSignUpView.tsx';
import { GlobalStyle } from './shared/globalStyle.tsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* <Route element={<Layout />}> */}
        <Route element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="feed" element={<FeedView />} />
          <Route path="savedContents" element={<SavedContentsView />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="/call" element={<VoiceCallView />} />

          {/* Auth */}
          <Route path="oauth2" element={<GoogleLoginView />} />
          <Route path="oauth2/code" element={<GoogleLoginView />} />
          <Route path="/signup" element={<GoogleSignupView />} />

          {/* savedContetns */}
          <Route path="savedContents/bookmark" element={<>북마크</>} />
          <Route path="savedContents/calls" element={<>call</>} />
          <Route path="savedContents/feed" element={<>feed</>} />

          <Route path="guide" element={<>서비스 가이드</>} />
          {/* User */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
