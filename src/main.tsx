
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/task-score.css'; 
import './components/task/task-card.css';
import { initializeDateTimeSettings } from './utils/dateUtils';

// Create a style element to disable pull-to-refresh
const disablePullToRefreshStyle = document.createElement('style');
disablePullToRefreshStyle.textContent = `
  html, body {
    overscroll-behavior-y: none;
  }
`;
document.head.appendChild(disablePullToRefreshStyle);

// Initialize date settings before app renders
initializeDateTimeSettings();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
