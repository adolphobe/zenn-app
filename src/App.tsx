
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ActoApp from "./pages/ActoApp";
import NotFound from "./pages/NotFound";
import StrategicReview from "./pages/StrategicReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ActoApp />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<></>} />
              <Route path="strategic-review" element={<StrategicReview />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
