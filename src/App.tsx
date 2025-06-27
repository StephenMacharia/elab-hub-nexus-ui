
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientDashboard from './components/Dashboards/PatientDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TechnicianDashboard from './components/Dashboards/TechnicianDashboard';
import { Sidebar } from './components/ui/sidebar';
const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="/technician/dashboard" element={<TechnicianDashboard/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
           

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
