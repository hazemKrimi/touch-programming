import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App.tsx';

import './index.css';

// TODO: Bring back strict mode when building and deploying
createRoot(document.querySelector('#root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
