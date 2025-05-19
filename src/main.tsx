
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/task-score.css'; 
import './components/task/task-card.css';
import { initializeDateTimeSettings } from './utils/dateUtils';

// Initialize date settings before app renders
initializeDateTimeSettings();

// Use HashRouter with a simplified configuration
const router = createHashRouter([
  {
    path: '*', // Single catch-all route to let App handle the routing
    element: <App />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
