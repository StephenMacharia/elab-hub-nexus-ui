  // Filter results when search term or results change
  useEffect(() => {
    if (!resultsSearchTerm) {
      setFilteredResults(results);
    } else {
      const lower = resultsSearchTerm.toLowerCase();
      setFilteredResults(
        results.filter(
          (item) =>
            (item.patientName && item.patientName.toLowerCase().includes(lower)) ||
            (item.mrn && item.mrn.toLowerCase().includes(lower))
        )
      );
    }
  }, [resultsSearchTerm, results]);
import React, { useEffect, useState, useRef } from "react";
// Removed duplicate Dialog import

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Printer, MessageSquare, Clock, FileText, User } from "lucide-react";
import jsPDF from "jspdf";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";


// Patient type for modal
interface Patient {
  name: string;
  dob: string;
  gender: string;
  mrn: string;
  testType: string;
}

// AddPatientForm component
function AddPatientForm({ onSubmit, onCancel }: { onSubmit: (p: Patient) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Patient>({ name: "", dob: "", gender: "", mrn: "", testType: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dob || !form.gender || !form.mrn || !form.testType) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">DOB</label>
        <input name="dob" type="date" value={form.dob} onChange={handleChange} className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 p-2 border rounded w-full">
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">MRN</label>
        <input name="mrn" value={form.mrn} onChange={handleChange} className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium">Test Type</label>
        <input name="testType" value={form.testType} onChange={handleChange} className="mt-1 p-2 border rounded w-full" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
      </div>
    </form>
  );
}


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

const PATIENTS_KEY = "lab_patients";

const TechnicianDashboard = () => {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem("patients");
    return stored ? JSON.parse(stored) : [];
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Search/filter state for results
  const [resultsSearchTerm, setResultsSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState<ResultItem[]>([]);
  const [searchDate, setSearchDate] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const printRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const currentPath = location.pathname;
    navigate(`${currentPath}?tab=${tabId}`, { replace: true });
  };

  // Dummy data for test queue
  const [testQueue, setTestQueue] = useState<TestQueueItem[]>(() => {
    const stored = localStorage.getItem("testQueue");
    if (stored) return JSON.parse(stored);
    return [
      { id: 1, patientName: "John Doe", mrn: "123456", testType: "Blood Test", status: "Pending", time: "09:00 AM" },
      { id: 2, patientName: "Jane Smith", mrn: "654321", testType: "Urine Test", status: "In Progress", time: "08:45 AM" },
      { id: 3, patientName: "Michael Johnson", mrn: "234567", testType: "Imaging", status: "Completed", time: "08:15 AM" },
      { id: 4, patientName: "Emily Brown", mrn: "345678", testType: "Biopsy", status: "Pending", time: "07:30 AM" },
    ];
  });

  // Results state, persisted in localStorage
  const [results, setResults] = useState<ResultItem[]>(() => {
    const stored = localStorage.getItem("lab_results");
    if (stored) return JSON.parse(stored);
    return [
      { patientName: "John Doe", testType: "Blood Test", result: "Normal", time: "08:15 AM" },
      { patientName: "Michael Johnson", testType: "Imaging", result: "No abnormalities", time: "09:30 AM" },
      { patientName: "Sarah Wilson", testType: "ECG", result: "Regular rhythm", time: "10:45 AM" },
    ];
  });

  // Persist results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lab_results", JSON.stringify(results));
  }, [results]);

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

  const updateTestStatus = (id: number, status: "Pending" | "In Progress" | "Completed") => {
    setTestQueue(testQueue.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    toast.success(`Test status updated to ${status}`);
  };

  // Export handlers for patient data
  const handleExportCSV = () => {
    if (!patients.length) return toast.info("No patient data to export");
    const header = "Name,DOB,Gender,MRN\n";
    const rows = patients.map(p => `${p.name},${p.dob},${p.gender},${p.mrn}`).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!patients.length) return toast.info("No patient data to export");
    // Simple Excel XML format for basic export
    const header = "<tr><th>Name</th><th>DOB</th><th>Gender</th><th>MRN</th></tr>";
    const rows = patients.map(p => `<tr><td>${p.name}</td><td>${p.dob}</td><td>${p.gender}</td><td>${p.mrn}</td></tr>`).join("");
    const table = `<table>${header}${rows}</table>`;
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>${table}</body></html>`;
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!patients.length) return toast.info("No patient data to export");
    const doc = new jsPDF();
    doc.text("Patient List", 10, 10);
    let y = 20;
    doc.text("Name", 10, y);
    doc.text("DOB", 60, y);
    doc.text("Gender", 110, y);
    doc.text("MRN", 150, y);
    y += 8;
    patients.forEach((p) => {
      doc.text(p.name, 10, y);
      doc.text(p.dob, 60, y);
      doc.text(p.gender, 110, y);
      doc.text(p.mrn, 150, y);
      y += 8;
    });
    doc.save("patients.pdf");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name or MRN..."
            value={resultsSearchTerm}
            onChange={e => setResultsSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setResultsSearchTerm(resultsSearchTerm)}
          >
            Search
          </button>
          <button
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onClick={() => setResultsSearchTerm("")}
          >
            Clear
          </button>
        </div>
      </div>
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
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.result}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No results available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={handleExportPDF} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          PDF
        </button>
        <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Excel
        </button>
        <button onClick={handleExportCSV} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
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

  // Add patient handler
  const handleAddPatient = (patient: Patient) => {
    const updated = [...patients, patient];
    setPatients(updated);
    localStorage.setItem("patients", JSON.stringify(updated));

    // Add to test queue and persist
    setTestQueue(prev => {
      const newQueue = [
        ...prev,
        {
          id: prev.length > 0 ? Math.max(...prev.map(q => q.id)) + 1 : 1,
          patientName: patient.name,
          mrn: patient.mrn,
          testType: patient.testType,
          status: "Pending",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      localStorage.setItem("testQueue", JSON.stringify(newQueue));
      return newQueue;
    });

    setShowAddPatient(false);
    toast.success("Patient added successfully!");
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
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            <Printer className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => setShowAddPatient(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Patient
          </button>
        </div>
      </motion.div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowAddPatient(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Add Patient</h2>
              <AddPatientForm
                onSubmit={handleAddPatient}
                onCancel={() => setShowAddPatient(false)}
              />
            </div>
          </div>
        </Dialog>
      )}


      <NavigationTabs />
      {renderContent()}
    </div>
  );
};

export default TechnicianDashboard;