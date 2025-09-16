import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Printer, MessageSquare, Clock, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import html2pdf from "html2pdf.js";
import "react-toastify/dist/ReactToastify.css";

interface Appointment {
  appointment_id: number;
  test_name: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  status: string;
  preparation?: string;
}

interface TestQueueItem {
  id: number;
  patientName: string;
  mrn: string;
  testType: string;
  status: "Pending" | "In Progress" | "Completed";
  time: string;
}

interface ResultItem {
  patientName: string;
  testType: string;
  result: string;
  time: string;
}

const syncAppointmentsToBackend = async (appointments: Appointment[]) => {
  console.log("Syncing to backend:", appointments);
  return new Promise((resolve) => setTimeout(resolve, 500));
};

const TechnicianDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const printRef = useRef<HTMLDivElement>(null);

  // Dummy data for test queue
  const [testQueue, setTestQueue] = useState<TestQueueItem[]>([
    { id: 1, patientName: "John Doe", mrn: "123456", testType: "Blood Test", status: "Pending", time: "09:00 AM" },
    { id: 2, patientName: "Jane Smith", mrn: "654321", testType: "Urine Test", status: "In Progress", time: "08:45 AM" },
    { id: 3, patientName: "Michael Johnson", mrn: "234567", testType: "Imaging", status: "Completed", time: "08:15 AM" },
    { id: 4, patientName: "Emily Brown", mrn: "345678", testType: "Biopsy", status: "Pending", time: "07:30 AM" },
  ]);

  // Dummy data for results
  const [results, setResults] = useState<ResultItem[]>([
    { patientName: "John Doe", testType: "Blood Test", result: "Normal", time: "08:15 AM" },
    { patientName: "Michael Johnson", testType: "Imaging", result: "No abnormalities", time: "09:30 AM" },
    { patientName: "Sarah Wilson", testType: "ECG", result: "Regular rhythm", time: "10:45 AM" },
  ]);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("local_patient_appointments");
    if (storedAppointments) {
      try {
        const parsed = JSON.parse(storedAppointments);
        setAppointments(parsed);
        setFilteredAppointments(parsed);
      } catch {
        console.warn("Invalid local_patient_appointments data.");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((a) => {
      const matchesTest = a.test_name.toLowerCase().includes(searchText.toLowerCase());
      const matchesDate = searchDate ? a.appointment_date === searchDate : true;
      return matchesTest && matchesDate;
    });
    setFilteredAppointments(filtered);
  }, [searchText, searchDate, appointments]);

  const handleMarkCompleted = async (id: number) => {
    const updated = appointments.map((a) =>
      a.appointment_id === id ? { ...a, status: "completed" } : a
    );
    setAppointments(updated);
    setFilteredAppointments(updated);
    localStorage.setItem("local_patient_appointments", JSON.stringify(updated));
    await syncAppointmentsToBackend(updated);
    toast.success("Appointment marked as completed!");
  };

  const handleExportPDF = () => {
    if (printRef.current) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: "appointments.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(printRef.current)
        .save();
    }
  };

  const updateTestStatus = (id: number, status: "Pending" | "In Progress" | "Completed") => {
    setTestQueue(testQueue.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    toast.success(`Test status updated to ${status}`);
  };

  const NavigationTabs = () => (
    <div className="flex flex-wrap border-b border-gray-200 mb-6">
      {[
        { id: "dashboard", label: "Dashboard", icon: <Calendar className="w-4 h-4" /> },
        { id: "appointments", label: "Appointments", icon: <Clock className="w-4 h-4" /> },
        { id: "testqueue", label: "Test Queue", icon: <FileText className="w-4 h-4" /> },
        { id: "results", label: "Results", icon: <CheckCircle className="w-4 h-4" /> },
        { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
        { id: "schedule", label: "Schedule", icon: <Calendar className="w-4 h-4" /> },
      ].map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-3 font-medium ${
            activeTab === tab.id
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by test name..."
          className="p-2 border rounded"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <div
        ref={printRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Booked Appointments
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            filteredAppointments.map((a) => (
              <div
                key={a.appointment_id}
                className="p-4 mb-3 border rounded-lg bg-gray-50"
              >
                <div className="font-medium text-gray-800">{a.test_name}</div>
                <div className="text-sm text-gray-600">
                  {new Date(a.appointment_date).toLocaleDateString()} @ {a.appointment_time}
                </div>
                <div className="text-sm text-gray-600">📍 {a.location}</div>
                <div
                  className={`text-xs mt-1 font-medium ${
                    a.status === "completed"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  Status: {a.status}
                </div>
                {a.status !== "completed" && (
                  <button
                    className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                    onClick={() => handleMarkCompleted(a.appointment_id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );

  const renderTestQueue = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Test Queue</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testQueue.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mrn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.testType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    item.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.status !== "In Progress" && (
                    <button
                      onClick={() => updateTestStatus(item.id, "In Progress")}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Start
                    </button>
                  )}
                  {item.status !== "Completed" && (
                    <button
                      onClick={() => updateTestStatus(item.id, "Completed")}
                      className="text-green-600 hover:text-green-900"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Results</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.testType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.result}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          PDF
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Excel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          CSV
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "testqueue":
        return renderTestQueue();
      case "results":
        return renderResults();
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h3>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage patient appointments and test results efficiently</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <Printer className="w-4 h-4" />
          Export PDF
        </button>
      </motion.div>

      <NavigationTabs />
      {renderContent()}
    </div>
  );
};

export default TechnicianDashboard;