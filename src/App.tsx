
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/hooks/use-toast';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth providers and pages
import { AuthProvider } from './context/auth';
import { AppProvider } from './context/AppProvider';
import { TaskDataProvider } from './context/TaskDataProvider';

// Auth-related pages
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import PasswordResetPage from './pages/ResetPassword';
import PasswordResetConfirmPage from './pages/auth/PasswordResetConfirmPage';

// Layouts
import { PrivateRoute } from './components/PrivateRoute';
import ActoApp from './pages/ActoApp';

// Main pages
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const TaskHistoryPage = lazy(() => import('./pages/task-history-new/TaskHistoryNewPage'));
const TaskHistoryNewPage = lazy(() => import('./pages/task-history-new/TaskHistoryNewPage'));
const StrategicReviewPage = lazy(() => import('./pages/StrategicReview'));
const LandingPage = lazy(() => import('./pages/Landing'));

// Mobile pages
const MobilePowerPage = lazy(() => import('./pages/mobile/MobilePowerPage'));
const MobileChronologicalPage = lazy(() => import('./pages/mobile/MobileChronologicalPage'));

// Error and not found pages
const NotFoundPage = lazy(() => import('./pages/NotFound'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App with all providers and routes
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppProvider>
            <TaskDataProvider>
              <Toaster />
              <Suspense fallback={<LoadingOverlay show={true} />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/reset-password" element={<PasswordResetPage />} />
                  <Route path="/reset-password/confirm" element={<PasswordResetConfirmPage />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route element={<ActoApp />}>
                      {/* Desktop Routes */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/task-history" element={<TaskHistoryPage />} />
                      <Route path="/task-history-new" element={<TaskHistoryNewPage />} />
                      <Route path="/strategic-review" element={<StrategicReviewPage />} />
                      
                      {/* Mobile Routes */}
                      <Route path="/mobile/power" element={<MobilePowerPage />} />
                      <Route path="/mobile/chronological" element={<MobileChronologicalPage />} />
                    </Route>
                  </Route>
                  
                  {/* Default and Not Found Routes */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </TaskDataProvider>
          </AppProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
