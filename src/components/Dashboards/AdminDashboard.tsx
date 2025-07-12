import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, QrCode, AlertCircle, CheckCircle, Calendar, TestTube2 } from 'lucide-react';
import {
  getAdminStats,
  getRecentUsers,
  getLabCapacity,
  getAlerts,
  uploadCensus,
  handleApiError
} from '../../services/api';
import StatsCard from './StatsCard';
import FileUpload from '../Admin/FileUpload';
import QRRegistration from '../Admin/QRRegistration';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  progress?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [labCapacity, setLabCapacity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, usersRes, labsRes, alertsRes] = await Promise.all([
          getAdminStats(),
          getRecentUsers(),
          getLabCapacity(),
          getAlerts()
        ]);

        // Transform stats data for the frontend
        const transformedStats = [
          { 
            title: "Total Users", 
            value: statsRes.total_users || 0, 
            icon: Users, 
            color: "blue" 
          },
          { 
            title: "Active Labs", 
            value: statsRes.active_labs || 0, 
            icon: Users, 
            color: "green" 
          },
          { 
            title: "Tests Conducted", 
            value: statsRes.total_tests || 0, 
            icon: TestTube2, 
            color: "purple" 
          },
          { 
            title: "Appointments Today", 
            value: statsRes.appointments_today || 0, 
            icon: Calendar, 
            color: "orange" 
          }
        ];

        setStats(transformedStats);
        setRecentUsers(usersRes || []);
        setLabCapacity(labsRes || []);
        setAlerts(alertsRes || []);
      } catch (err) {
        handleApiError(err, 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(0);
      const res = await uploadCensus(formData);
      // Refresh stats after successful upload
      const statsRes = await getAdminStats();
      setStats([
        { 
          title: "Total Users", 
          value: statsRes.total_users, 
          icon: Users, 
          color: "blue" 
        },
        { 
          title: "Active Labs", 
          value: statsRes.active_labs, 
          icon: Users, 
          color: "green" 
        },
        { 
          title: "Tests Conducted", 
          value: statsRes.total_tests, 
          icon: TestTube2, 
          color: "purple" 
        },
        { 
          title: "Appointments Today", 
          value: statsRes.appointments_today, 
          icon: Calendar, 
          color: "orange" 
        }
      ]);
    } catch (err) {
      handleApiError(err, 'Upload failed');
    } finally {
      setTimeout(() => setUploadProgress(0), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of system performance and user activity</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload Census
            <input 
              type="file" 
              hidden 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
              accept=".csv,.xlsx,.xls"
            />
          </label>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => (document.getElementById('qr_modal') as HTMLDialogElement)?.showModal()}
          >
            <QrCode className="h-4 w-4" />
            QR Registration
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard 
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change ?? 0}
              trend={stat.trend ?? 'neutral'}
            />
          </motion.div>
        ))}
      </div>

      {/* Upload and QR Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Census File Upload</h3>
          </div>
          <p className="text-gray-600 mb-6">Upload patient census lists to bulk register users</p>
          <FileUpload 
            onFileUpload={handleFileUpload} 
            progress={uploadProgress}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <QRRegistration />
        </motion.div>
      </div>

      {/* Recent Users and Lab Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-10 w-10 text-gray-400" />
                <p className="text-gray-500 mt-2">No recent user activity</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lab Capacity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Capacity</h3>
          <div className="space-y-4">
            {labCapacity.length > 0 ? (
              labCapacity.map((lab) => (
                <div key={lab.lab_id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{lab.name}</span>
                    <span className="text-sm text-gray-500">
                      {lab.current}/{lab.max} ({lab.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lab.percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-2.5 rounded-full ${
                        lab.percentage > 85 ? 'bg-red-500' : 
                        lab.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TestTube2 className="mx-auto h-10 w-10 text-gray-400" />
                <p className="text-gray-500 mt-2">No lab capacity data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.timestamp}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  alert.type === 'warning' ? 
                  'bg-red-50 border border-red-200' : 
                  'bg-green-50 border border-green-200'
                }`}
              >
                {alert.type === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    alert.type === 'warning' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {alert.title}
                  </p>
                  <p className={`text-sm ${
                    alert.type === 'warning' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {alert.message}
                  </p>
                </div>
                <span className={`text-xs ${
                  alert.type === 'warning' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-10 w-10 text-green-400" />
              <p className="text-gray-500 mt-2">No system alerts - all systems normal</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* QR Modal */}
      <dialog id="qr_modal" className="modal">
        <div className="modal-box">
          <QRRegistration />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminDashboard;