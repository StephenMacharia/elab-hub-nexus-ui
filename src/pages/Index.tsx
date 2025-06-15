
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import LoginPage from '@/components/Auth/LoginPage';
import RegisterPage from '@/components/Auth/RegisterPage';
import AdminDashboard from '@/components/Dashboards/AdminDashboard';
import TechnicianDashboard from '@/components/Dashboards/TechnicianDashboard';
import PatientDashboard from '@/components/Dashboards/PatientDashboard';
import ChatInterface from '@/components/Chat/ChatInterface';

type AuthMode = 'login' | 'register';
type UserRole = 'admin' | 'technician' | 'patient';

interface User {
  email: string;
  name: string;
  role: UserRole;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleLogin = (role: UserRole, email: string) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setUser({ email, name, role });
    setIsAuthenticated(true);
  };

  const handleRegister = (role: UserRole, email: string, name: string) => {
    setUser({ email, name, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowChat(false);
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

  const getChatRecipient = () => {
    if (!user) return { name: '', role: '' };
    
    switch (user.role) {
      case 'admin':
        return { name: 'Dr. Sarah Wilson', role: 'Lab Manager' };
      case 'technician':
        return { name: 'Dr. Martinez', role: 'Chief Physician' };
      case 'patient':
        return { name: 'Dr. Sarah Wilson', role: 'Lab Technician' };
      default:
        return { name: 'Support Team', role: 'Customer Service' };
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

  if (showChat) {
    const recipient = getChatRecipient();
    return (
      <Layout userRole={user!.role} userName={user!.name}>
        <div className="h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Chat</h2>
            <button
              onClick={() => setShowChat(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <ChatInterface
            recipientName={recipient.name}
            recipientRole={recipient.role}
            isOnline={true}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user!.role} userName={user!.name}>
      <div className="space-y-6">
        {renderDashboard()}
        
        {/* Floating Chat Button */}
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 h-14 w-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50 flex items-center justify-center"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.828-.456l-3.406 1.136.146-.293L8 19.5A8 8 0 1121 12z" />
          </svg>
        </button>
      </div>
    </Layout>
  );
};

export default Index;
