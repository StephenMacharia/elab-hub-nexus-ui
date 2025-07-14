import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, FileText, MessageCircle, CheckCircle,
} from "lucide-react";
import {
  getPatientDashboardStats,
  getUpcomingAppointments,
  getRecentTestResults,
  getMessages,
  createAppointment,
  handleApiError,
} from "../../services/api";
import StatsCard from "./StatsCard";
import WellnessTracker from "../Patient/WellnessTracker";
import GameficationPanel from "../Patient/GameficationPanel";
import PersonalizedHealthTips from "../Patient/PersonalizedHealthTips";

interface StatsResponse {
  appointments: number;
  test_results: number;
  unread_messages: number;
  health_score: string;
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

// Utility storage functions
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save key "${key}" to storage`);
  }
};

const getFromStorage = <T,>(key: string): T | null => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined") return null;
  try {
    return JSON.parse(value);
  } catch {
    console.warn(`Invalid JSON in localStorage for key "${key}"`);
    return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "normal": return "text-green-600 bg-green-100";
    case "low": return "text-orange-600 bg-orange-100";
    case "high": return "text-red-600 bg-red-100";
    default: return "text-gray-600 bg-gray-100";
  }
};

const AppointmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: {
    test_name: string;
    appointment_date: string;
    appointment_time: string;
    location: string;
  }) => void;
}> = ({ isOpen, onClose, onAddAppointment }) => {
  const [testName, setTestName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      test_name: testName,
      appointment_date: date,
      appointment_time: time,
      location,
    });
    onClose();
    setTestName("");
    setDate("");
    setTime("");
    setLocation("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [username] = useState(localStorage.getItem("username") ?? "");
  const [userId] = useState<number | null>(
    Number(localStorage.getItem("userId")) || null
  );

  const [stats, setStats] = useState<StatsResponse | null>(
    getFromStorage("patient_stats")
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleAddAppointment = async (data: {
    test_name: string;
    appointment_date: string;
    appointment_time: string;
    location: string;
  }) => {
    try {
      const saved = await createAppointment(data);
      setAppointments((prev) => [...prev, saved]);

      if (userId) {
        const key = `appointments_user_${userId}`;
        const local = getFromStorage<Appointment[]>(key) || [];
        local.push(saved);
        saveToStorage(key, local);
      }
    } catch (e) {
      handleApiError(e, "Failed to create appointment");
    }
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
        saveToStorage("patient_stats", s);

        const localAppointments =
          getFromStorage<Appointment[]>(`appointments_user_${userId}`) || [];
        const merged = [...a];

        localAppointments.forEach((local) => {
          if (!merged.some((apiApp) => apiApp.appointment_id === local.appointment_id)) {
            merged.push(local);
          }
        });

        setAppointments(merged);
        setResults(r);
        saveToStorage("patient_results", r);

        if (userId) {
          const m = await getMessages(userId);
          setMessages(m);
          saveToStorage("patient_messages", m);
        }
      } catch (e) {
        handleApiError(e, "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
      change: "+0",
      trend: "up" as const,
      icon: Calendar,
      color: "blue" as const,
    },
    {
      title: "Test Results",
      value: stats.test_results.toString(),
      change: "+0",
      trend: "up" as const,
      icon: FileText,
      color: "green" as const,
    },
    {
      title: "Unread Messages",
      value: stats.unread_messages.toString(),
      change: "+0",
      trend: "up" as const,
      icon: MessageCircle,
      color: "orange" as const,
    },
    {
      title: "Health Score",
      value: stats.health_score,
      change: "+0",
      trend: "up" as const,
      icon: CheckCircle,
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{username ? `, ${username}` : ""}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your health journey
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Book Appointment
        </button>
      </motion.div>

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddAppointment={handleAddAppointment}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <WellnessTracker />
        </motion.div>
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <GameficationPanel />
        </motion.div>
      </div>

      <PersonalizedHealthTips />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Upcoming Appointments
          </h3>
          {appointments.length === 0 && (
            <p className="text-gray-500">No upcoming appointments.</p>
          )}
          {appointments.map((a) => (
            <div key={a.appointment_id} className="p-4 mb-3 border rounded-lg bg-gray-50">
              <div className="font-medium text-gray-800">{a.test_name}</div>
              <div className="text-sm text-gray-600">
                {new Date(a.appointment_date).toLocaleDateString()} @ {a.appointment_time}
              </div>
              <div className="text-sm text-gray-600">📍 {a.location}</div>
              {a.preparation && (
                <div className="text-xs mt-1 text-blue-600">{a.preparation}</div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" /> Recent Results
          </h3>
          {results.length === 0 && <p className="text-gray-500">No results yet.</p>}
          {results.map((r) => (
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
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" /> Messages
        </h3>
        {messages.length === 0 && <p className="text-gray-500">No messages.</p>}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 mb-3 border rounded-lg ${
              m.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50"
            }`}
          >
            <div className="font-medium">{m.subject}</div>
            <p className="text-sm text-gray-600">{m.preview}</p>
            <span className="text-xs text-gray-500">
              {new Date(m.sent_at).toLocaleString()}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
