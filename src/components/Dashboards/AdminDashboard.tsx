import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import {
  getAdminStats, getRecentUsers, getLabCapacity,
  getAlerts, uploadCensus
} from '../../services/api';
import StatsCard from './StatsCard';
import FileUpload from '../Admin/FileUpload';
import QRRegistration from '../Admin/QRRegistration';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [labCapacity, setLabCapacity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const limit = 5;
  const totalPages = Math.max(1, Math.ceil(userTotal / limit));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, labsRes, alertsRes] = await Promise.all([
          getAdminStats(),
          getLabCapacity(),
          getAlerts()
        ]);

        const data = statsRes?.data || {};

        const parsedStats = [
          { title: "Total Users", value: data.total_users || 0, icon: "Users", color: "blue" },
          { title: "Active Patients", value: data.active_patients || 0, icon: "Users", color: "green" },
          { title: "Tests Conducted", value: data.total_tests || 0, icon: "TestTube", color: "purple" },
          { title: "Appointments Today", value: data.todays_appointments || 0, icon: "Calendar", color: "orange" }
        ];

        setStats(parsedStats);
        setLabCapacity(Array.isArray(labsRes) ? labsRes : []);
        setAlerts(Array.isArray(alertsRes) ? alertsRes : []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getRecentUsers();
        setRecentUsers(res?.users || []);
        setUserTotal(res?.total || 0);
      } catch (err) {
        console.error('Error loading recent users:', err);
      }
    };
    fetchUsers();
  }, [userPage]);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadCensus(formData);
      alert(res?.data?.message || 'Upload successful');
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of system performance and user activity</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload Census
            <input type="file" hidden onChange={(e) => handleFileUpload(e.target.files?.[0])} />
          </label>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Registration
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Upload and QR */}
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
          <FileUpload onFileUpload={handleFileUpload} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QRRegistration />
        </motion.div>
      </div>

      {/* Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-4">
            <button
              disabled={userPage === 1}
              onClick={() => setUserPage(p => p - 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {userPage} of {totalPages}</span>
            <button
              disabled={userPage === totalPages}
              onClick={() => setUserPage(p => p + 1)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
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
            {labCapacity.map((lab, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{lab.name}</span>
                  <span className="text-sm text-gray-500">{lab.current}/{lab.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lab.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-2 rounded-full ${lab.percentage > 85 ? 'bg-red-500' : lab.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  />
                </div>
              </div>
            ))}
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
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 ${alert.type === 'warning' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} rounded-lg`}
            >
              {alert.type === 'warning' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${alert.type === 'warning' ? 'text-red-800' : 'text-green-800'}`}>{alert.title}</p>
                <p className={`text-sm ${alert.type === 'warning' ? 'text-red-600' : 'text-green-600'}`}>{alert.message}</p>
              </div>
              <span className={`text-xs ${alert.type === 'warning' ? 'text-red-500' : 'text-green-500'}`}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
