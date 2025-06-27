import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TestTube, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginUser, getCurrentUser } from '../../services/api';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'lab_tech' | 'patient', username: string) => void;
  onSwitchToRegister: () => void;
}

const LoginPage = ({ onLogin, onSwitchToRegister }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(username, password);
      localStorage.setItem("accessToken", data.access_token);

      const user = await getCurrentUser();
      const { role, username: fetchedUsername } = user;

      localStorage.setItem("userRole", role);
      localStorage.setItem("username", fetchedUsername);

      toast.success('✅ Login successful!');
      onLogin(role, fetchedUsername);

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'lab_tech') navigate('/technician/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      toast.error('❌ Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'admin' as const, username: 'admin@elabhub.com', label: 'Administrator', color: 'bg-purple-500', password: 'admin123' },
    { role: 'lab_tech' as const, username: 'tech@elabhub.com', label: 'Lab Technician', color: 'bg-green-500', password: 'tech123' },
    { role: 'patient' as const, username: 'patient@elabhub.com', label: 'Patient', color: 'bg-blue-500', password: 'patient123' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <TestTube className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to E-Lab Hub</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <p className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</p>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <motion.button
                key={cred.role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={() => {
                  setUsername(cred.username);
                  setPassword(cred.password);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white transition-colors text-left"
              >
                <div className={`h-3 w-3 ${cred.color} rounded-full`}></div>
                <span className="text-sm text-gray-700">{cred.label}: {cred.username}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Create Account
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
