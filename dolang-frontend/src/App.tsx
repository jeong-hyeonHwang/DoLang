import React from 'react';
import { Routes, Route } from 'react-router';
import { StompClientProvider } from './features/Matching/hooks/useClientContext.tsx';
import MainView from './app/routes/MainView.tsx';
import LayoutDesign from './shared/Layout.tsx';
import LayoutNoNav from './shared/LayoutNoNav.tsx';
import FeedView from './app/routes/FeedView.tsx';
import SavedContentsView from './app/routes/SavedContentsView.tsx';
import VoiceCallView from './app/routes/VoiceCallView.tsx';
import UserProfileView from './app/routes/UserProfileView.tsx';
import GoogleSignupView from './features/Auth/GoogleSignUpView.tsx';
import GoogleLogin from './features/Auth/GoogleLogin.tsx';
import SignupForm from './features/Auth/SignupForm.tsx';
import { GlobalStyle } from './shared/globalStyle.tsx';
import { CallContextProvider } from './features/VoiceCall/hooks/useCallContext.tsx';
import { PeerContextProvider } from './features/VoiceCall/hooks/usePeerContext.tsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* <Route element={<Layout />}> */}
        {/* <Route element={<Layout />}> */}
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
          <Route path="feed" element={<FeedView />} />
          <Route path="savedContents" element={<SavedContentsView />} />
          <Route path="profile" element={<UserProfileView />} />
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

          {/* savedContetns */}
          <Route path="savedContents/bookmark" element={<>북마크</>} />
          <Route path="savedContents/calls" element={<>call</>} />
          <Route path="savedContents/feed" element={<>feed</>} />

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
