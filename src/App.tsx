
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "@/hooks/use-toast-context";
import ActoApp from "./pages/ActoApp";
import NotFound from "./pages/NotFound";
import StrategicReview from "./pages/StrategicReview";
import TaskHistory from "./pages/TaskHistory";
import Landing from "./pages/Landing";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./auth/AuthProvider";
import { PrivateRoute } from "./auth/PrivateRoute";
import { UserProvider } from "./context/UserContext";

// Criando um wrapper para proteger todas as rotas do ActoApp
const ProtectedLayout = () => {
  return (
    <ActoApp>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="strategic-review" element={<StrategicReview />} />
        <Route path="history" element={<TaskHistory />} />
      </Routes>
    </ActoApp>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <UserProvider>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rotas protegidas usando o PrivateRoute com layout compartilhado */}
                  <Route element={<PrivateRoute />}>
                    {/* Redirect de / para /dashboard para consistência com o fluxo */}
                    <Route path="/dashboard/*" element={<ProtectedLayout />} />
                    <Route path="/strategic-review" element={<ProtectedLayout />} />
                    <Route path="/history" element={<ProtectedLayout />} />
                  </Route>
                  
                  {/* Fallback para qualquer outra rota */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </UserProvider>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
