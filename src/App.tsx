
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "@/hooks/use-toast-context";
import ActoApp from "./pages/ActoApp";
import NotFound from "./pages/NotFound";
import StrategicReview from "./pages/StrategicReview";
import TaskHistory from "./pages/TaskHistory";
import Login from "./pages/Login";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/" element={<ActoApp />}>
                <Route path="dashboard" element={<></>} />
                <Route path="strategic-review" element={<StrategicReview />} />
                <Route path="history" element={<TaskHistory />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
