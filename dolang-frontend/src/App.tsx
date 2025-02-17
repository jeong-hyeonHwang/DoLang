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
import EndCallView from './app/routes/EndCallView.tsx';

import MyFeedView from './app/routes/SavedContents/MyFeed/MyFeedView.tsx';
import BookmarkView from './app/routes/SavedContents/Bookmark/BookmarkView.tsx';
import BookMarkDetailView from './app/routes/SavedContents/Bookmark/BookmarkDetailView.tsx';
import ServiceGuideView from './app/routes/ServiceGuideView.tsx';
import ProtectedRoute from './app/ProtectedRoute.tsx';
import VoiceRecordView from './app/routes/SavedContents/VoiceRecord/VoiceRecordView.tsx';

import AudioFeed from './app/routes/SavedContents/AudioFeed.tsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <PeerContextProvider>
        <StompClientProvider>
          <CallContextProvider>
            <Routes>
              <Route element={<LayoutDesign />}>
                <Route index element={<MainView />} />
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

              <Route path="/call" element={<VoiceCallView />} />
              <Route path="endCall" element={<EndCallView />} />

              <Route path="/A" element={<AudioFeed />}></Route>
            </Routes>
          </CallContextProvider>
        </StompClientProvider>
      </PeerContextProvider>
    </>
  );
}

export default App;
