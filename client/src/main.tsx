import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './index.css';

// TODO: Bring back strict mode when building and deploying
createRoot(document.getElementById('root')).render(<App />);
