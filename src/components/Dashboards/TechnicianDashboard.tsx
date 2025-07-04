import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TestTube, Clock, CheckCircle, AlertTriangle,
  User, MessageCircle
} from 'lucide-react';
import StatsCard from './StatsCard';
import {
  getTechnicianStats, getTestQueue, updateTestStatus,
  getTechnicianMessages
} from '../../services/api';
import { toast } from 'react-toastify';

const TechnicianDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [testQueue, setTestQueue] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, queueData, messageData] = await Promise.all([
          getTechnicianStats(),
          getTestQueue(),
          getTechnicianMessages()
        ]);
        setStats(statsData.data);
        setTestQueue(queueData.data);
        setMessages(messageData.data);
      } catch (err) {
        toast.error('❌ Failed to load technician dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // WebSocket for real-time updates
    const ws = new WebSocket("ws://localhost:8000/ws/labtech");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_test') {
        setTestQueue(prev => [data.test, ...prev]);
        toast.info(`🧪 New test added: ${data.test.id}`);
      }
    };

    return () => ws.close();
  }, []);

  const handleStartTest = async (testId: string) => {
    try {
      await updateTestStatus(testId, 'In Progress');
      toast.success(`✅ Test ${testId} started`);
      setTestQueue((prev) =>
        prev.map(t => t.id === testId ? { ...t, status: 'In Progress' } : t)
      );
    } catch (err) {
      toast.error(`❌ Could not start test ${testId}`);
    }
  };

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
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Submit Results</button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">View All Tests</button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(loading ? Array.from({ length: 4 }) : stats).map((stat: any, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            {loading ? (
              <div className="h-28 bg-gray-200 animate-pulse rounded-xl" />
            ) : (
              <StatsCard {...stat} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Queue */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
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
                      <Clock className="h-4 w-4" /> Est. {test.estimated_time}
                    </p>
                  </div>
                  {test.status === 'Pending' && (
                    <button
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      onClick={() => handleStartTest(test.id)}
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-4 rounded-lg border ${msg.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{msg.from}</p>
                      {msg.unread && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{msg.message}</p>
                    <p className="text-xs text-gray-500">{msg.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
            View All Messages
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
