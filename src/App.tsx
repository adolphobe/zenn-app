
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './context/auth';
import { UserProvider } from './context/UserContext';
import ActoApp from './pages/ActoApp';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { PrivateRoute } from './components/PrivateRoute';
import { AppProvider } from './context/AppProvider';
import { Toaster } from './components/ui/toaster';
import Dashboard from './components/Dashboard';
import TaskHistory from './pages/TaskHistory';
import StrategicReview from './pages/StrategicReview';
import Dashboard2 from './components/Dashboard2';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDataProvider } from './context/TaskDataProvider';
import TaskProviders from './components/task/TaskProviders';
import { TooltipProvider } from './components/ui/tooltip';

// Client com melhorias de cache para reduzir requisições
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // Aumentado para 1 minuto
      retry: 1,
      refetchOnWindowFocus: false, // Desativado para reduzir re-renderizações
      refetchOnMount: false,
    },
  },
});

function App() {
  const location = useLocation();
  
  // Detecta e corrige URLs duplicadas (como /task-history#/task-history)
  useEffect(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash;

    // Verifica se há hash e se contém um caminho duplicado
    if (currentHash && currentHash.length > 1) {
      // Se o hash contém o mesmo caminho que já estamos, ou se o hash contém outro caminho
      // conhecido, isso indica um problema de rota duplicada
      const hashPath = currentHash.substring(1);
      if (currentPath === hashPath || 
          (currentPath === '/task-history' && hashPath.includes('/dashboard')) ||
          currentPath.includes(hashPath)) {
        
        // Corrige a URL sem recarregar a página
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        console.log('URL corrigida para evitar duplicação:', window.location.pathname);
      }
    }
  }, [location]);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <AuthProvider>
              <AppProvider>
                <TaskProviders>
                  <TaskDataProvider>
                    <UserProvider>
                      <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/app" element={<ActoApp />} />
                        
                        {/* Rotas protegidas com autenticação */}
                        <Route element={<PrivateRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/dashboard2" element={<Dashboard2 />} />
                          
                          {/* Rota normal para o histórico de tarefas */}
                          <Route path="/task-history" element={<TaskHistory />} />
                          
                          <Route path="/strategic-review" element={<StrategicReview />} />
                          <Route path="/settings" element={<Settings />} />
                        </Route>
                        
                        {/* Redireciona URLs incorretas para a página correta */}
                        <Route path="/dashboard/task-history" element={<Navigate to="/task-history" replace />} />
                        
                        {/* Captura todas as outras rotas não definidas */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </UserProvider>
                  </TaskDataProvider>
                </TaskProviders>
              </AppProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
