import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, User } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'lab_tech' | 'patient';
  userName?: string;
}

type ValidRoles = 'admin' | 'lab_tech' | 'patient';
const validRoles: ValidRoles[] = ['admin', 'lab_tech', 'patient'];

const Layout = ({ children, userRole, userName }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<ValidRoles | null>(null);
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const parsedRole = parsed.role;

        if (validRoles.includes(parsedRole)) {
          setRole(parsedRole);
        } else {
          console.warn('Invalid role found in localStorage:', parsedRole);
        }

        setName(parsed.name || '');
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  const finalRole = userRole || role;
  const finalName = userName || name;

  // Show loading fallback
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );
  }

  // Prevent rendering if role is not valid
  if (!finalRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        ⚠️ Unable to determine user role. Please log in again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar userRole={finalRole} />
      </div>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full z-50"
            >
              <Sidebar userRole={finalRole} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900">E-Lab Hub</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {finalName || 'User'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
