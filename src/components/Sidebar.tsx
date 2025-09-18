import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  TestTube,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  X,
  FileText,
  Activity,
  User,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../services/api';

export type ValidRoles = 'admin' | 'lab_tech' | 'patient';

interface SidebarProps {
  userRole: ValidRoles;
  onClose?: () => void;
}

const Sidebar = ({ userRole, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = `/${userRole}`;

  const adminMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: `${basePath}/dashboard` },
    { icon: Users, label: 'Users', path: `${basePath}/users` },
    // Redirect Labs to TechnicianDashboard Results tab
    { icon: TestTube, label: 'Labs', path: `/technician/dashboard?tab=results` },
    { icon: Calendar, label: 'Appointments', path: `${basePath}/appointments` },
    { icon: FileText, label: 'Reports', path: `${basePath}/reports` },
    { icon: Settings, label: 'Settings', path: `${basePath}/settings` },
  ];

  const technicianMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: `/technician/dashboard?tab=dashboard`},
    { icon: TestTube, label: 'Test Queue', path: `/technician/dashboard?tab=testqueue`},
    { icon: FileText, label: 'Results', path: `/technician/dashboard?tab=results`},
    { icon: MessageCircle, label: 'Messages', path: `/technician/dashboard?tab=messages`},
    { icon: Calendar, label: 'Schedule', path: `/technician/dashboard?tab=schedule`},
    {icon: Activity, label: 'Reports', path: '/technician/dashboard?tab=reports'},
  ];

  const patientMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: `${basePath}/dashboard` },
    { icon: Calendar, label: 'Appointments', path: `${basePath}/appointments` },
    { icon: FileText, label: 'Test Results', path: `${basePath}/test-results` },
    { icon: MessageCircle, label: 'Chat', path: `${basePath}/chat` },
    { icon: User, label: 'Profile', path: `${basePath}/profile` },
  ];

  const menuMap = {
    admin: adminMenuItems,
    lab_tech: technicianMenuItems,
    patient: patientMenuItems,
  };

  const roleLabels = {
    admin: 'Administrator',
    lab_tech: 'Lab Technician',
    patient: 'Patient',
  };

  const roleColors = {
    admin: 'bg-purple-500',
    lab_tech: 'bg-green-500',
    patient: 'bg-blue-500',
  };

  const menuItems = menuMap[userRole];

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const isMenuItemActive = (itemPath: string) => {
    if (userRole === 'lab_tech') {
      const urlParams = new URLSearchParams(location.search);
      const currentTab = urlParams.get('tab') || 'dashboard';
      const itemTab = new URLSearchParams(itemPath.split('?')[1] || '').get('tab') || 'dashboard';
      return location.pathname.includes('/dashboard') && currentTab === itemTab;
    }
    return location.pathname === itemPath;
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white h-full shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 ${roleColors[userRole]} rounded-lg flex items-center justify-center`}>
              <TestTube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">E-Lab Hub</h2>
              <p className="text-xs text-gray-500">{roleLabels[userRole]}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => {
                    navigate(item.path);
                    window.scrollTo(0, 0);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
