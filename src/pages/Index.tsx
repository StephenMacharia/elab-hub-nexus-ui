import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginPage from '@/components/Auth/LoginPage';
import RegisterPage from '@/components/Auth/RegisterPage';
import AdminDashboard from '@/components/Dashboards/AdminDashboard';
import TechnicianDashboard from '@/components/Dashboards/TechnicianDashboard';
import PatientDashboard from '@/components/Dashboards/PatientDashboard';
import Layout from '@/components/Layout';
import Appointments from './Appointments';
import TestResults from './TestResults';
import Chat from './Chat';
import Profile from './Profile';
import Logout from './Logout';

type AuthMode = 'login' | 'register';
type UserRole = 'admin' | 'technician' | 'patient';
type PageType = 'dashboard' | 'appointments' | 'testResults' | 'chat' | 'profile' | 'logout';

interface User {
  email: string;
  name: string;
  role: UserRole;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const handleLogin = (role: UserRole, email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setUser({ email, name, role });
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleRegister = (role: UserRole, email: string, name: string) => {
    setUser({ email, name, role });
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'technician':
        return <TechnicianDashboard />;
      case 'patient':
        return <PatientDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  const renderCurrentPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'dashboard':
        return (
          <Layout userRole={user.role} userName={user.name} onNavigate={handleNavigation}>
            {renderDashboard()}
          </Layout>
        );
      case 'appointments':
        return <Appointments userRole={user.role} userName={user.name} />;
      case 'testResults':
        return <TestResults userRole={user.role} userName={user.name} />;
      case 'chat':
        return <Chat userRole={user.role} userName={user.name} />;
      case 'profile':
        return <Profile userRole={user.role} userName={user.name} />;
      case 'logout':
        return <Logout onLogout={handleLogout} />;
      default:
        return (
          <Layout userRole={user.role} userName={user.name} onNavigate={handleNavigation}>
            {renderDashboard()}
          </Layout>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        {authMode === 'login' ? (
          <LoginPage
            key="login"
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterPage
            key="register"
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </AnimatePresence>
    );
  }

  return renderCurrentPage();
};

export default Index;
