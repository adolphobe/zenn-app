
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/hooks/use-toast-context";
import ActoApp from "./pages/ActoApp";
import NotFound from "./pages/NotFound";
import StrategicReview from "./pages/StrategicReview";
import TaskHistory from "./pages/TaskHistory";
import Landing from "./pages/Landing";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./context/UserContext";

// Create Query Client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    },
  },
});

const App = () => {
  // Debug logging
  const renderLog = () => {
    console.log('[AUTH:APP] Inicializando aplicação');
    return null;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <UserProvider>
                {renderLog()}
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes using PrivateRoute */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<ActoApp />}>
                      <Route index element={<Dashboard />} />
                      <Route path="strategic-review" element={<StrategicReview />} />
                      <Route path="history" element={<TaskHistory />} />
                    </Route>
                  </Route>
                  
                  {/* Legacy route redirects */}
                  <Route path="/strategic-review" element={<Navigate to="/dashboard/strategic-review" replace />} />
                  <Route path="/history" element={<Navigate to="/dashboard/history" replace />} />
                  
                  {/* Fallback route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UserProvider>
            </AuthProvider>
          </ToastProvider>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
