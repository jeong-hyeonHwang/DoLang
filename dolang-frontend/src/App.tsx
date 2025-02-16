import React from 'react';
import { Routes, Route } from 'react-router';
import LayoutDesign from './shared/Layout.tsx';
import LayoutNoNav from './shared/LayoutNoNav.tsx';
import MainView from './app/routes/MainView.tsx';
import { StompClientProvider } from './features/Matching/hooks/useClientContext.tsx';
import Layout from './shared/Layout.tsx';
import FeedView from './app/routes/FeedView.tsx';
import SavedContentsView from './app/routes/SavedContentsView.tsx';
import VoiceCallView from './app/routes/VoiceCallView.tsx';
import UserProfileView from './app/routes/UserProfileView.tsx';
import GoogleLoginView from './features/Auth/GoogleLoginView.tsx';
import GoogleSignupView from './features/Auth/GoogleSignUpView.tsx';
import GoogleLogin from './features/Auth/GoogleLogin.tsx';
import SignupForm from './features/Auth/SignupForm.tsx';
import { GlobalStyle } from './shared/globalStyle.tsx';
import { CallContextProvider } from './features/VoiceCall/hooks/useCallContext.tsx';
import { PeerContextProvider } from './features/VoiceCall/hooks/usePeerContext.tsx';

import MyFeedView from './app/routes/SavedContents/MyFeed/MyFeedView.tsx';
import BookmarkView from './app/routes/SavedContents/Bookmark/BookmarkView.tsx';
import BookMarkDetailView from './app/routes/SavedContents/Bookmark/BookmarkDetailView.tsx';

import ServiceGuideView from './app/routes/ServiceGuideView.tsx';

import ProtectedRoute from './app/ProtectedRoute.tsx';
import VoiceRecordView from './app/routes/SavedContents/VoiceRecord/VoiceRecordView.tsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<LayoutDesign />}>
          <Route
            index
            element={
              <PeerContextProvider>
                <StompClientProvider>
                  <MainView />
                </StompClientProvider>
              </PeerContextProvider>
            }
          />
        </Route>
        <Route element={<Layout />}>
          <Route path="feed" element={<FeedView />} />
          <Route path="savedContents" element={<SavedContentsView />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <UserProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/call"
            element={
              <PeerContextProvider>
                <StompClientProvider>
                  <CallContextProvider>
                    <VoiceCallView />
                  </CallContextProvider>
                </StompClientProvider>
              </PeerContextProvider>
            }
          />

          {/* Auth */}
          <Route path="oauth2" element={<GoogleLoginView />} />
          <Route path="oauth2/code" element={<GoogleLoginView />} />
          <Route path="/signup" element={<GoogleSignupView />} />

          {/* savedContetns */}
          <Route
            path="savedContents/bookmark"
            element={
              <ProtectedRoute>
                <BookmarkView />
              </ProtectedRoute>
            }
          />
          <Route
            path="savedContents/bookmark/detail/:date"
            element={
              <ProtectedRoute>
                <BookMarkDetailView />
              </ProtectedRoute>
            }
          />
          <Route
            path="savedContents/calls"
            element={
              <ProtectedRoute>
                <VoiceRecordView />
              </ProtectedRoute>
            }
          />
          <Route
            path="savedContents/feed"
            element={
              <ProtectedRoute>
                <MyFeedView />
              </ProtectedRoute>
            }
          />

          <Route path="guide" element={<ServiceGuideView />} />
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
