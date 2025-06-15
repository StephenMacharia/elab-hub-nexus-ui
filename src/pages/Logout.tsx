
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, CheckCircle } from 'lucide-react';

interface LogoutProps {
  onLogout: () => void;
}

const Logout = ({ onLogout }: LogoutProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLogout();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLogout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Logged Out Successfully</h2>
          <p className="text-gray-600 mb-6">
            You have been safely logged out of E-Lab Hub. Thank you for using our platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <LogOut className="h-4 w-4" />
          </motion.div>
          <span>Redirecting to login...</span>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "linear" }}
          className="h-2 bg-blue-500 rounded-full mt-6"
        />
      </motion.div>
    </div>
  );
};

export default Logout;
