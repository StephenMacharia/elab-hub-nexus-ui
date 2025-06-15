
import React from 'react';
import { motion } from 'framer-motion';
import { TestTube, Clock, CheckCircle, AlertTriangle, User, MessageCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const TechnicianDashboard = () => {
  const stats = [
    {
      title: 'Pending Tests',
      value: '24',
      change: '+6',
      trend: 'up' as const,
      icon: TestTube,
      color: 'blue'
    },
    {
      title: 'Completed Today',
      value: '47',
      change: '+15%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Urgent Tests',
      value: '3',
      change: '-2',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Average Time',
      value: '45min',
      change: '-5min',
      trend: 'down' as const,
      icon: Clock,
      color: 'purple'
    }
  ];

  const testQueue = [
    {
      id: 'TST-001',
      patient: 'John Doe',
      test: 'Blood Chemistry Panel',
      priority: 'Urgent',
      estimatedTime: '30 min',
      status: 'In Progress'
    },
    {
      id: 'TST-002',
      patient: 'Jane Smith',
      test: 'Complete Blood Count',
      priority: 'Normal',
      estimatedTime: '15 min',
      status: 'Pending'
    },
    {
      id: 'TST-003',
      patient: 'Mike Johnson',
      test: 'Lipid Profile',
      priority: 'Normal',
      estimatedTime: '20 min',
      status: 'Pending'
    },
    {
      id: 'TST-004',
      patient: 'Sarah Wilson',
      test: 'Thyroid Function',
      priority: 'High',
      estimatedTime: '25 min',
      status: 'Pending'
    }
  ];

  const recentMessages = [
    {
      from: 'Dr. Martinez',
      message: 'Please prioritize TST-001 for emergency patient',
      time: '2 mins ago',
      unread: true
    },
    {
      from: 'Lab Manager',
      message: 'New protocol update for blood tests available',
      time: '15 mins ago',
      unread: true
    },
    {
      from: 'Patient Services',
      message: 'Patient inquiry about TST-002 results',
      time: '1 hour ago',
      unread: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Lab Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your test queue and track progress</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Submit Results
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View All Tests
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Queue</h3>
            <span className="text-sm text-gray-500">{testQueue.length} tests pending</span>
          </div>
          
          <div className="space-y-4">
            {testQueue.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TestTube className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{test.id}</p>
                      <p className="text-sm text-gray-500">{test.patient}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(test.priority)}`}>
                      {test.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{test.test}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Est. {test.estimatedTime}
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                    Start Test
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentMessages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{message.from}</p>
                      {message.unread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                    <p className="text-xs text-gray-500">{message.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            View All Messages
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
