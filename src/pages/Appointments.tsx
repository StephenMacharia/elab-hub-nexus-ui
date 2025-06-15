
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Filter, Plus } from 'lucide-react';
import Layout from '@/components/Layout';

interface AppointmentsProps {
  userRole: 'admin' | 'technician' | 'patient';
  userName: string;
}

const Appointments = ({ userRole, userName }: AppointmentsProps) => {
  const [filter, setFilter] = useState('all');

  const appointments = [
    {
      id: 1,
      patient: 'John Smith',
      test: 'Complete Blood Count',
      date: '2024-12-18',
      time: '9:00 AM',
      location: 'Main Lab',
      status: 'Confirmed',
      technician: 'Dr. Sarah Wilson'
    },
    {
      id: 2,
      patient: 'Emily Johnson',
      test: 'Lipid Profile',
      date: '2024-12-18',
      time: '10:30 AM',
      location: 'Cardiology Lab',
      status: 'Pending',
      technician: 'Dr. Michael Chen'
    },
    {
      id: 3,
      patient: 'Mike Davis',
      test: 'Thyroid Function',
      date: '2024-12-19',
      time: '2:00 PM',
      location: 'Endocrine Lab',
      status: 'Confirmed',
      technician: 'Dr. Lisa Park'
    },
    {
      id: 4,
      patient: 'Sarah Wilson',
      test: 'Glucose Tolerance Test',
      date: '2024-12-20',
      time: '8:00 AM',
      location: 'Main Lab',
      status: 'Rescheduled',
      technician: 'Dr. James Wright'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rescheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage and view all appointments</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2">
              {['all', 'today', 'upcoming', 'pending'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Appointments</h3>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.patient}</h4>
                        <p className="text-sm text-gray-600">{appointment.test}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      <strong>Technician:</strong> {appointment.technician}
                    </span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Appointments;
