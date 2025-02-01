import './App.css';
import { Routes, Route } from 'react-router';
import Layout from './shared/Layout';
import MainPage from './app/routes/MainView';
import FeedView from './app/routes/FeedView';
import SavedContentsView from './app/routes/SavedContentsView';
import UserProfileView from './app/routes/UserProfileView';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="feed" element={<FeedView />} />
        <Route path="savedContents" element={<SavedContentsView />} />
        <Route path="profile" element={<UserProfileView />} />
      </Route>
    </Routes>
  );
}

export default App;
