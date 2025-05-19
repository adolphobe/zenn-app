
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskDataProvider } from './context/TaskDataProvider';
import TaskProviders from './components/task/TaskProviders';
import { TooltipProvider } from './components/ui/tooltip';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  // Initialize date settings
  React.useEffect(() => {
    import('./utils/dateUtils').then(({ initializeDateTimeSettings }) => {
      initializeDateTimeSettings();
      console.log('Configurações de data e hora inicializadas');
    });
  }, []);

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
                        <Route element={<PrivateRoute />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          {/* Removed dashboard2 route */}
                          <Route path="/task-history" element={<TaskHistory />} />
                          {/* No longer need duplicate task-history route without leading slash */}
                          <Route path="/strategic-review" element={<StrategicReview />} />
                          <Route path="/settings" element={<Settings />} />
                        </Route>
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
