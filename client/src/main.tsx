import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// TODO: Bring back string mode when building and deploying
createRoot(document.getElementById('root')).render(<App />);
