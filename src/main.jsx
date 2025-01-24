import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import reactive from 'react';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
