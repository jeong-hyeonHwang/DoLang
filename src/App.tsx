import { Routes, Route } from 'react-router';
import Layout from './shared/Layout';
import MainPage from './app/routes/MainView';
import FeedView from './app/routes/FeedView';
import SavedContentsView from './app/routes/SavedContentsView';
import UserProfileView from './app/routes/UserProfileView';
import GoogleLoginView from './shared/components/Auth/GoogleLoginView';
import SignUpView from './shared/components/Auth/SignUpView';
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
          {/* <Route path="oauth2" element={<GoogleLoginView />} /> modal 처리예정 */}
          <Route path="oauth2/code" element={<GoogleLoginView />} /> {/* modal 처리예정 */}
          <Route path="signup" element={<SignUpView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
