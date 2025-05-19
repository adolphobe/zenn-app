
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/task-score.css'; // Added task score styling
import './components/task/task-card.css';

// Configuração corrigida do HashRouter para evitar duplicação de rotas
const router = createHashRouter([
  {
    path: '/*',
    element: <App />,
    // Removendo basename para evitar duplicação de rotas
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
