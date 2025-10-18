import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DiseasePredictor from "./pages/DiseasePredictor";
import PrescriptionBuddy from "./pages/PrescriptionBuddy";
import MentalBuddy from "./pages/MentalBuddy";
import HospitalFinder from "./pages/HospitalFinder";
import Prevention from "./pages/Prevention";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disease-predictor" element={<DiseasePredictor />} />
          <Route path="/prescription-buddy" element={<PrescriptionBuddy />} />
          <Route path="/mental-buddy" element={<MentalBuddy />} />
          <Route path="/hospital-finder" element={<HospitalFinder />} />
          <Route path="/prevention" element={<Prevention />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
