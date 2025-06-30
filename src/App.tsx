import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from './components/Auth/LoginPage';       // ✅ Add this
import RegisterPage from './components/Auth/RegisterPage'; // ✅ Add this

import PatientDashboard from './components/Dashboards/PatientDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TechnicianDashboard from './components/Dashboards/TechnicianDashboard';
import Layout from './components/Layout';

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/patient/dashboard"
              element={
                <Layout>
                  <PatientDashboard />
                </Layout>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              }
            />
            <Route
              path="/technician/dashboard"
              element={
                <Layout>
                  <TechnicianDashboard />
                </Layout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
