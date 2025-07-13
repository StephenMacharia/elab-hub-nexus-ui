import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, MessageCircle, CheckCircle } from "lucide-react";
import {
  getPatientDashboardStats,
  getUpcomingAppointments,
  getRecentTestResults,
  getMessages,
  handleApiError,
  createAppointment,
} from "../../services/api";
import StatsCard from "./StatsCard";
import WellnessTracker from "../Patient/WellnessTracker";
import GameficationPanel from "../Patient/GameficationPanel";
import PersonalizedHealthTips from "../Patient/PersonalizedHealthTips";

interface Appointment {
  appointment_id: number;
  test_name: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  status: string;
  preparation?: string;
}

interface TestResult {
  id: number;
  test_name: string;
  date: string;
  status: string;
}

interface Message {
  id: number;
  sender_name: string;
  subject: string;
  preview: string;
  sent_at: string;
  unread: boolean;
}

interface StatsResponse {
  appointments: number;
  test_results: number;
  unread_messages: number;
  health_score: string;
}

const AppointmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (newAppointment: Appointment) => void;
}> = ({ isOpen, onClose, onAddAppointment }) => {
  const [testName, setTestName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      appointment_id: Date.now(),
      test_name: testName,
      appointment_date: date,
      appointment_time: time,
      location,
      status: "scheduled",
    };

    try {
      await createAppointment(newAppointment); // Store to backend
      onAddAppointment(newAppointment);        // Store to local state + localStorage
      onClose();
      setTestName("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (err) {
      handleApiError(err, "Failed to book appointment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-3 py-2" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "normal": return "text-green-600 bg-green-100";
    case "low": return "text-orange-600 bg-orange-100";
    case "high": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const saveToStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromStorage = <T,>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const PatientDashboard = () => {
  const [username] = useState(localStorage.getItem("username") ?? "");
  const [userId] = useState<number | null>(
    Number(localStorage.getItem("userId")) || null
  );

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleAddAppointment = (newAppointment: Appointment) => {
    const key = `appointments_user_${userId}`;
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    saveToStorage(key, updated);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, a, r] = await Promise.all([
          getPatientDashboardStats(),
          getUpcomingAppointments(),
          getRecentTestResults(),
        ]);
        setStats(s);
        setResults(r);
        saveToStorage("patient_stats", s);
        saveToStorage("patient_results", r);

        const localAppointments = getFromStorage<Appointment[]>(`appointments_user_${userId}`) || [];
        const merged = [...a];

        localAppointments.forEach((appt) => {
          if (!merged.some((m) => m.appointment_id === appt.appointment_id)) {
            merged.push(appt);
          }
        });

        setAppointments(merged);

        if (userId) {
          const m = await getMessages(userId);
          setMessages(m);
          saveToStorage("patient_messages", m);
        }
      } catch (err) {
        handleApiError(err, "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAll();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Could not load dashboard.
      </div>
    );
  }

  const statsCards = [
    {
      title: "Upcoming Tests",
      value: appointments.length.toString(),
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Test Results",
      value: stats.test_results.toString(),
      icon: FileText,
      color: "green",
    },
    {
      title: "Unread Messages",
      value: stats.unread_messages.toString(),
      icon: MessageCircle,
      color: "orange",
    },
    {
      title: "Health Score",
      value: stats.health_score,
      icon: CheckCircle,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{username ? `, ${username}` : ""}!
          </h1>
          <p className="text-gray-600 mt-1">Here's an overview of your health journey</p>
        </div>
        <button onClick={() => setShowModal(true)} className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Book Appointment
        </button>
      </motion.div>

      <AppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} onAddAppointment={handleAddAppointment} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WellnessTracker />
        <GameficationPanel />
      </div>

      <PersonalizedHealthTips />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Upcoming Appointments
          </h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments.</p>
          ) : (
            appointments.map((a) => (
              <div key={a.appointment_id} className="p-4 mb-3 border rounded-lg bg-gray-50">
                <div className="font-medium text-gray-800">{a.test_name}</div>
                <div className="text-sm text-gray-600">
                  {new Date(a.appointment_date).toLocaleDateString()} @ {a.appointment_time}
                </div>
                <div className="text-sm text-gray-600">📍 {a.location}</div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" /> Recent Results
          </h3>
          {results.length === 0 ? (
            <p className="text-gray-500">No results yet.</p>
          ) : (
            results.map((r) => (
              <div key={r.id} className="flex justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{r.test_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(r.status)}`}>
                  {r.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" /> Messages
        </h3>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`p-4 mb-3 border rounded-lg ${m.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}>
              <div className="font-medium">{m.subject}</div>
              <p className="text-sm text-gray-600">{m.preview}</p>
              <span className="text-xs text-gray-500">
                {new Date(m.sent_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
