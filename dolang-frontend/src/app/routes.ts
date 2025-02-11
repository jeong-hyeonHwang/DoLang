import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./shared/Layout.tsx', [
    index('routes/MainView.tsx'),
    route('feed', 'routes/FeedView.tsx'),
    route('savedContents', 'routes/SavedContentsView.tsx'),
    route('profile', 'routes/UserProfileView.tsx'),
  ]),
];
