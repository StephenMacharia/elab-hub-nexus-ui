
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Filter, Search } from 'lucide-react';

interface TestResultsProps {
  userRole: 'admin' | 'technician' | 'patient';
  userName: string;
}

const TestResults = ({ userRole, userName }: TestResultsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const testResults = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      // patient: 'John Smith',
      date: '2024-12-15',
      status: 'Normal',
      category: 'Hematology',
      technician: 'Dr. Sarah Wilson',
      downloadUrl: '#'
    },
    {
      id: 2,
      testName: 'Lipid Profile',
      // patient: 'Emily Johnson',
      date: '2024-12-14',
      status: 'Abnormal',
      category: 'Chemistry',
      technician: 'Dr. Michael Chen',
      downloadUrl: '#'
    },
    {
      id: 3,
      testName: 'Thyroid Function Test',
      // patient: 'Mike Davis',
      date: '2024-12-13',
      status: 'Normal',
      category: 'Endocrinology',
      technician: 'Dr. Lisa Park',
      downloadUrl: '#'
    },
    {
      id: 4,
      testName: 'Glucose Test',
      // patient: 'Sarah Wilson',
      date: '2024-12-12',
      status: 'High',
      category: 'Chemistry',
      technician: 'Dr. James Wright',
      downloadUrl: '#'
    },
    {
      id: 5,
      testName: 'Vitamin D Level',
      // patient: 'Alex Brown',
      date: '2024-12-11',
      status: 'Low',
      category: 'Chemistry',
      technician: 'Dr. Sarah Wilson',
      downloadUrl: '#'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'abnormal': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hematology': return 'bg-purple-100 text-purple-800';
      case 'chemistry': return 'bg-blue-100 text-blue-800';
      case 'endocrinology': return 'bg-green-100 text-green-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
            <p className="text-gray-600 mt-1">View and manage all test results</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Test Results</h3>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{result.testName}</h4>
                        {/* <p className="text-sm text-gray-600">{result.patient}</p> */}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Test Date: {result.date}</span>
                    </div>
                    <div>
                      <span><strong>Technician:</strong> {result.technician}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Result ID: #{result.id.toString().padStart(4, '0')}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                      <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
    </div>
  );
};

export default TestResults;
