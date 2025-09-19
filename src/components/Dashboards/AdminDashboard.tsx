import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Upload, QrCode, AlertCircle, CheckCircle, Calendar, TestTube2 } from 'lucide-react';
import {
  getAdminStats,
  getRecentUsers,
  getLabCapacity,
  getAlerts,
  uploadCensus,
  handleApiError,
  getAllAppointments
} from '../../services/api';
import StatsCard from './StatsCard';
import FileUpload from '../Admin/FileUpload';
import QRRegistration from '../Admin/QRRegistration';
import { StatusPieChart, StatusBarChart, StatusDonutChart } from "../ui/StatusCharts";
import ReportsPage from '../../pages/Reports';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  progress?: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  // Remove labCapacity, add labResults
  const [labResults, setLabResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showReports, setShowReports] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [appointmentsSearch, setAppointmentsSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  // Fetch all appointments for admin
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (e) {
        handleApiError(e, "Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  // Filter appointments by patient name or status
  useEffect(() => {
    if (!appointmentsSearch) {
      setFilteredAppointments(appointments);
    } else {
      const lower = appointmentsSearch.toLowerCase();
      setFilteredAppointments(
        appointments.filter(
          (a) =>
            (a.patient_name && a.patient_name.toLowerCase().includes(lower)) ||
            (a.status && a.status.toLowerCase().includes(lower))
        )
      );
    }
  }, [appointmentsSearch, appointments]);

  // Helper to aggregate status counts from labResults
  const getStatusData = () => {
    const statusCounts = { Pending: 0, "In Progress": 0, Completed: 0 };
    filteredLabResults.forEach((item) => {
      const status = (item.status || "Pending").toLowerCase();
      if (status.includes("progress")) statusCounts["In Progress"]++;
      else if (status.includes("complete")) statusCounts["Completed"]++;
      else statusCounts["Pending"]++;
    });
    return [
      { status: "Pending", value: statusCounts["Pending"] },
      { status: "In Progress", value: statusCounts["In Progress"] },
      { status: "Completed", value: statusCounts["Completed"] },
    ];
  };

  // Search/filter state for lab results
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLabResults, setFilteredLabResults] = useState([]);

  // Always filter by all relevant fields
  useEffect(() => {
    if (!searchTerm) {
      setFilteredLabResults(labResults);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredLabResults(
        labResults.filter(
          (item) =>
            (item.patientName && item.patientName.toLowerCase().includes(lower)) ||
            (item.mrn && item.mrn.toLowerCase().includes(lower)) ||
            (item.labName && item.labName.toLowerCase().includes(lower)) ||
            (item.testType && item.testType.toLowerCase().includes(lower)) ||
            (item.result && item.result.toLowerCase().includes(lower))
        )
      );
    }
  }, [searchTerm, labResults]);

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
        // Only fetch results from technician (localStorage)
        let results = [];
        try {
          const stored = localStorage.getItem("lab_results");
          if (stored) results = JSON.parse(stored);
        } catch {}
        setLabResults(results);
        setSelectedResults([]);
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
            onClick={() => setShowReports((prev) => !prev)}
          >
            <TestTube2 className="h-4 w-4" />
            {showReports ? 'Hide Reports' : 'View Reports'}
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            onClick={() => (document.getElementById('qr_modal') as HTMLDialogElement)?.showModal()}
          >
            <QrCode className="h-4 w-4" />
            QR Registration
          </button>
        </div>
      </motion.div>

      {/* Reports Section */}
      {showReports && (
        <div className="my-6">
          <ReportsPage />
        </div>
      )}

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

      {/* Recent Users, Appointments, and Lab Results */}
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

        {/* Appointments Table removed. Appointments now only show when the sidebar button is clicked. */}

        {/* Lab Results (from TechnicianDashboard) - with checkboxes, download, reports, and search */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Labs</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:items-center">
              <input
              type="text"
              placeholder="Search by patient, MRN, lab name, test type, or result..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 text-sm flex-1 min-w-0"
              style={{ maxWidth: '260px' }}
              />
              <div className="flex gap-2 w-full sm:w-auto">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                onClick={e => {
                e.preventDefault();
                // Explicitly trigger filtering by updating filteredLabResults
                const lower = searchTerm.toLowerCase();
                setFilteredLabResults(
                labResults.filter(
                (item) =>
                  (item.patientName && item.patientName.toLowerCase().includes(lower)) ||
                  (item.mrn && item.mrn.toLowerCase().includes(lower)) ||
                  (item.labName && item.labName.toLowerCase().includes(lower)) ||
                  (item.testType && item.testType.toLowerCase().includes(lower)) ||
                  (item.result && item.result.toLowerCase().includes(lower))
                )
                );
                }}
              >
                Search
              </button>
              <button
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full sm:w-auto"
                onClick={e => { e.preventDefault(); setSearchTerm(""); }}
              >
                Clear
              </button>
              </div>
            </div>
            </div>
            {/* Lab Tests Table */}
            <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-2">Lab Tests</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">CBC</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Lab</td>
                </tr>
                <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lipid Panel</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Chemistry Lab</td>
                </tr>
                <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Blood Sugar</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Endocrine Lab</td>
                </tr>
              </tbody>
              </table>
            </div>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredLabResults && filteredLabResults.length > 0
                  ? filteredLabResults
                  : [
                      // Dummy data if no real lab results
                      {
                        patientName: 'John Doe',
                        mrn: '1001',
                        labName: 'Main Lab',
                        testType: 'CBC',
                        result: 'Normal',
                        time: '2025-09-19 10:00',
                      },
                      {
                        patientName: 'Jane Smith',
                        mrn: '1002',
                        labName: 'Chemistry Lab',
                        testType: 'Lipid Panel',
                        result: 'High Cholesterol',
                        time: '2025-09-19 11:30',
                      },
                      {
                        patientName: 'Alice Brown',
                        mrn: '1003',
                        labName: 'Endocrine Lab',
                        testType: 'Blood Sugar',
                        result: 'Elevated',
                        time: '2025-09-19 09:15',
                      },
                    ]
                ).map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <input
                        type="checkbox"
                        checked={selectedResults.includes(index)}
                        onChange={e => {
                          setSelectedResults(prev =>
                            e.target.checked
                              ? [...prev, index]
                              : prev.filter(i => i !== index)
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.testType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.result}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.labName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={selectedResults.length === 0}
              onClick={() => {
                // Download selected results as CSV
                const header = "Patient Name,Test Type,Result,Time\n";
                const rows = filteredLabResults
                  .filter((_, idx) => selectedResults.includes(idx))
                  .map(item => `${item.patientName},${item.testType},${item.result},${item.time}`)
                  .join("\n");
                const csv = header + rows;
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "selected_lab_results.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Selected Results
            </button>
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