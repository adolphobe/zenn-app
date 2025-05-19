
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/task-score.css'; // Added task score styling
import './components/task/task-card.css';

// Configuração do HashRouter otimizada - corrigindo problemas com rotas aninhadas
const router = createHashRouter([
  {
    path: '/*', // Este pattern captura todas as rotas na aplicação
    element: <App />
  },
]);

// Render the app with improved error boundary
// Note: React must be defined and imported here for hooks to work correctly
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
