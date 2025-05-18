
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="acto-theme">
      <AuthProvider>
        <UserProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/app" element={<ActoApp />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard2" element={<Dashboard2 />} />
                  <Route path="/task-history" element={<TaskHistory />} />
                  <Route path="/strategic-review" element={<StrategicReview />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </AppProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
