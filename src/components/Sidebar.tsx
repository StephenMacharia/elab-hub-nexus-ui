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
  Clock,
  User
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'technician' | 'patient';
  onClose?: () => void;
  onNavigate?: (page: string) => void;
}

const Sidebar = ({ userRole, onClose, onNavigate }: SidebarProps) => {
  const adminMenuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users', active: false },
    { icon: TestTube, label: 'Labs', active: false },
    { icon: Calendar, label: 'Appointments', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const technicianMenuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: TestTube, label: 'Test Queue', active: false },
    { icon: FileText, label: 'Results', active: false },
    { icon: MessageCircle, label: 'Messages', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
  ];

  const patientMenuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Appointments', active: false },
    { icon: FileText, label: 'Test Results', active: false },
    { icon: MessageCircle, label: 'Chat', active: false },
    { icon: User, label: 'Profile', active: false },
  ];

  const menuItems = {
    admin: adminMenuItems,
    technician: technicianMenuItems,
    patient: patientMenuItems,
  }[userRole];

  const roleColors = {
    admin: 'bg-purple-500',
    technician: 'bg-green-500', 
    patient: 'bg-blue-500',
  };

  const roleLabels = {
    admin: 'Administrator',
    technician: 'Lab Technician',
    patient: 'Patient',
  };

  const handleNavigation = (label: string) => {
    if (onNavigate) {
      const pageMap: { [key: string]: string } = {
        'Dashboard': 'dashboard',
        'Appointments': 'appointments',
        'Test Results': 'testResults',
        'Test Queue': 'testResults',
        'Results': 'testResults',
        'Messages': 'chat',
        'Chat': 'chat',
        'Profile': 'profile',
        'Logout': 'logout'
      };
      
      const page = pageMap[label] || 'dashboard';
      onNavigate(page);
    }
    
    if (onClose) {
      onClose();
    }
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
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleNavigation(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button 
          onClick={() => handleNavigation('Logout')}
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
