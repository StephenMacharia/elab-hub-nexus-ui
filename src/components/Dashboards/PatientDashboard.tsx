
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const PatientDashboard = () => {
  const stats = [
    {
      title: 'Upcoming Tests',
      value: '2',
      change: '+1',
      trend: 'up' as const,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Test Results',
      value: '8',
      change: '+2',
      trend: 'up' as const,
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Unread Messages',
      value: '3',
      change: '+1',
      trend: 'up' as const,
      icon: MessageCircle,
      color: 'orange'
    },
    {
      title: 'Health Score',
      value: '85%',
      change: '+5%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'purple'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      test: 'Annual Blood Work',
      date: 'Tomorrow',
      time: '9:00 AM',
      location: 'Main Lab',
      status: 'Confirmed',
      preparation: 'Fasting required (12 hours)'
    },
    {
      id: 2,
      test: 'Follow-up Lipid Panel',
      date: 'Dec 20, 2024',
      time: '2:30 PM',
      location: 'Cardiology Lab',
      status: 'Confirmed',
      preparation: 'No special preparation needed'
    }
  ];

  const recentResults = [
    {
      id: 1,
      test: 'Complete Blood Count',
      date: 'Dec 10, 2024',
      status: 'Normal',
      viewable: true
    },
    {
      id: 2,
      test: 'Thyroid Function Test',
      date: 'Dec 8, 2024',
      status: 'Normal',
      viewable: true
    },
    {
      id: 3,
      test: 'Vitamin D Level',
      date: 'Dec 5, 2024',
      status: 'Low',
      viewable: true
    },
    {
      id: 4,
      test: 'Blood Glucose',
      date: 'Dec 1, 2024',
      status: 'Normal',
      viewable: true
    }
  ];

  const messages = [
    {
      from: 'Dr. Sarah Wilson',
      subject: 'Your recent test results',
      preview: 'Your blood work results look good. Please schedule a follow-up...',
      time: '2 hours ago',
      unread: true
    },
    {
      from: 'Lab Services',
      subject: 'Appointment reminder',
      preview: 'This is a reminder for your appointment tomorrow at 9:00 AM...',
      time: '1 day ago',
      unread: true
    },
    {
      from: 'Dr. Michael Chen',
      subject: 'Prescription refill',
      preview: 'Your prescription is ready for pickup at the pharmacy...',
      time: '3 days ago',
      unread: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your health journey</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Book Appointment
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.test}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {appointment.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {appointment.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Location:</strong> {appointment.location}</p>
                  <p><strong>Preparation:</strong> {appointment.preparation}</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                    Reschedule
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Test Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {recentResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{result.test}</p>
                  <p className="text-sm text-gray-500">{result.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                  {result.viewable && (
                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                      View
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View All Results
          </button>
        </motion.div>
      </div>

      {/* Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <MessageCircle className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{message.from}</p>
                    {message.unread && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="font-medium text-gray-800 text-sm mb-1">{message.subject}</p>
                  <p className="text-sm text-gray-600">{message.preview}</p>
                </div>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Open Chat
        </button>
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
