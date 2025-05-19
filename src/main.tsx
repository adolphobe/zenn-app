
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/task-score.css'; // Added task score styling
import './components/task/task-card.css';
import { initializeDateTimeSettings } from './utils/dateUtils';

// Initialize date settings before app renders
initializeDateTimeSettings();

// Improved HashRouter configuration to fix nested routes issues
const router = createHashRouter([
  {
    path: '/*', // This pattern captures all routes in the application
    element: <App />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
