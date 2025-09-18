            <Route
              path="/patient/appointments"
              element={
                <Layout>
                  <Appointments userRole="patient" userName={localStorage.getItem("username") || "Patient"} />
                </Layout>
              }
            />
import TestResults from './pages/TestResults';
import SettingsPage from './pages/Settings';
import Profile from './pages/Profile';
import UsersPage from './pages/Users';
import Appointments from './pages/Appointments';
import ReportsPage from './pages/Reports';
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from './components/Auth/LoginPage';       
import RegisterPage from './components/Auth/RegisterPage'; 

import PatientDashboard from './components/Dashboards/PatientDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TechnicianDashboard from './components/Dashboards/TechnicianDashboard';
import Layout from './components/Layout';
import Chat from './pages/Chat';

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
              path="/patient/chat"
              element={
                <Layout userRole="patient">
                  <Chat userRole="patient" userName={localStorage.getItem("username") || "Patient"} />
                </Layout>
              }
            />
            <Route
              path="/patient/test-results"
              element={
                <Layout>
                  <TestResults userRole="patient" userName={localStorage.getItem("username") || "Patient"} />
                </Layout>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <Layout>
                  <Profile userRole="patient" userName={localStorage.getItem("username") || "Patient"} />
                </Layout>
              }
            />
            <Route
              path="/patient/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <Layout>
                  <SettingsPage />
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
              path="/admin/appointments"
              element={
                <Layout>
                  <Appointments userRole="admin" userName={localStorage.getItem("username") || "Admin"} />
                </Layout>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <Layout>
                  <ReportsPage />
                </Layout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Layout>
                  <UsersPage />
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
