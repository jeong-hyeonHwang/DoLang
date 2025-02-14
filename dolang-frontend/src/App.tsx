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
import Bookmarks from './app/routes/SavedContents/Bookmark.tsx';
import AudioFeed from './app/routes/SavedContents/AudioFeed.tsx';
import { CallContextProvider } from './features/VoiceCall/hooks/useCallContext.tsx';
import { PeerContextProvider } from './features/VoiceCall/hooks/usePeerContext.tsx';
import EndCallView from './app/routes/EndCallView.tsx';

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
                <Route path="profile" element={<UserProfileView />} />

                {/* Auth */}
                <Route path="oauth2" element={<GoogleLoginView />} />
                <Route path="oauth2/code" element={<GoogleLoginView />} />
                <Route path="/signup" element={<GoogleSignupView />} />

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

              <Route path="/call" element={<VoiceCallView />} />
              <Route path="endCall" element={<EndCallView />} />
            </Routes>
          </CallContextProvider>
        </StompClientProvider>
      </PeerContextProvider>
    </>
  );
}

export default App;
