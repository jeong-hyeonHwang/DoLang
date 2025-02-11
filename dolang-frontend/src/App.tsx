import React from 'react';
import { Routes, Route } from 'react-router';
import LayoutDesign from './shared/Layout.tsx';
import LayoutNoNav from './shared/LayoutNoNav.tsx';
import MainPage from './app/routes/MainView.tsx';
import FeedView from './app/routes/FeedView.tsx';
import SavedContentsView from './app/routes/SavedContentsView.tsx';
import VoiceCallView from './app/routes/VoiceCallView.tsx';
import UserProfileView from './app/routes/UserProfileView.tsx';
import GoogleSignupView from './features/Auth/GoogleSignUpView.tsx';
import GoogleLogin from './features/Auth/GoogleLogin.tsx';
import SignupForm from './features/Auth/SignupForm.tsx';
import { GlobalStyle } from './shared/globalStyle.tsx';

import Bookmarks from './app/routes/SavedContents/Bookmark.tsx';
import AudioFeed from './app/routes/SavedContents/AudioFeed.tsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<LayoutDesign />}>
          <Route index element={<MainPage />} />
          <Route path="feed" element={<FeedView />} />
          <Route path="savedContents" element={<SavedContentsView />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="/call" element={<VoiceCallView />} />

          {/* savedContetns */}
          <Route path="savedContents/bookmark" element={<Bookmarks />} />
          <Route path="savedContents/calls" element={<> 음성기록 </>} />
          <Route path="savedContents/feed" element={<AudioFeed />} />

          <Route path="guide" element={<>서비스 가이드</>} />
          {/* User */}
        </Route>

        {/* Auth */}
        <Route>
          <Route element={<LayoutNoNav />}>
            <Route path="oauth2/code" element={<GoogleLogin />} />
            <Route path="signup" element={<GoogleSignupView />} />
            <Route path="signup/register" element={<SignupForm />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
