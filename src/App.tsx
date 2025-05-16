
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/hooks/use-toast-context";
import ActoApp from "./pages/ActoApp";
import NotFound from "./pages/NotFound";
import StrategicReview from "./pages/StrategicReview";
import TaskHistory from "./pages/TaskHistory";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./components/Dashboard";

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
              <Route path="/dashboard" element={<ActoApp />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/strategic-review" element={<ActoApp />}>
                <Route index element={<StrategicReview />} />
              </Route>
              <Route path="/history" element={<ActoApp />}>
                <Route index element={<TaskHistory />} />
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
