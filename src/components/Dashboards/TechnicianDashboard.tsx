import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Printer } from "lucide-react";
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
  const printRef = useRef<HTMLDivElement>(null);

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
          <p className="text-gray-600 mt-1">Manage patient appointments efficiently</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          <Printer className="w-4 h-4" />
          Export PDF
        </button>
      </motion.div>

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
};

export default TechnicianDashboard;
