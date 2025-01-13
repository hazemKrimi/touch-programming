import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// TODO: Bring back string mode when building and deploying
createRoot(document.getElementById('root')).render(
    <App />
);
