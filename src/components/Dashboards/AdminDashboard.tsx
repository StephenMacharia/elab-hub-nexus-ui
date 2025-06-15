
import React from 'react';
import { motion } from 'framer-motion';
import { Users, TestTube, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Active Labs',
      value: '23',
      change: '+2',
      trend: 'up' as const,
      icon: TestTube,
      color: 'green' as const
    },
    {
      title: 'Today\'s Appointments',
      value: '186',
      change: '-5%',
      trend: 'down' as const,
      icon: Calendar,
      color: 'orange' as const
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'purple' as const
    }
  ];

  const recentUsers = [
    { name: 'Dr. Sarah Wilson', role: 'Lab Technician', status: 'Active', time: '2 mins ago' },
    { name: 'John Smith', role: 'Patient', status: 'Pending', time: '5 mins ago' },
    { name: 'Dr. Michael Chen', role: 'Lab Technician', status: 'Active', time: '10 mins ago' },
    { name: 'Emily Johnson', role: 'Patient', status: 'Active', time: '15 mins ago' },
  ];

  const labCapacity = [
    { name: 'Main Lab', current: 45, max: 50, percentage: 90 },
    { name: 'Cardiology Lab', current: 23, max: 30, percentage: 77 },
    { name: 'Pathology Lab', current: 18, max: 25, percentage: 72 },
    { name: 'Radiology Lab', current: 12, max: 20, percentage: 60 },
  ];

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
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Generate Report
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lab Capacity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
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
                    className={`h-2 rounded-full ${
                      lab.percentage > 85 ? 'bg-red-500' :
                      lab.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-red-800">Main Lab approaching capacity</p>
              <p className="text-sm text-red-600">Current utilization: 90% (45/50)</p>
            </div>
            <span className="text-xs text-red-500">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="font-medium text-green-800">System backup completed successfully</p>
              <p className="text-sm text-green-600">All data has been backed up securely</p>
            </div>
            <span className="text-xs text-green-500">5 mins ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
