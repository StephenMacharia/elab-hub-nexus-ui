import axios from "axios";
import { toast } from "react-toastify";

// ==========================
// 🔧 Axios Setup
// ==========================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==========================
// ❌ Global Error Handler
// ==========================
export const handleApiError = (err: unknown, msg = "Something went wrong") => {
  console.error(err);
  toast.error(`❌ ${msg}`);
};

// ==========================
// 🔐 Auth Routes
// ==========================
export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email.toLowerCase());
  formData.append("password", password);

  const response = await API.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: "admin" | "lab_tech" | "patient"
) => {
  const response = await API.post("/auth/register", {
    username,
    email,
    password,
    role,
    is_active: true,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const logoutUser = () => API.post("/auth/logout").then((res) => res.data);

// ==========================
// 👤 Patient Dashboard
// ==========================
export const getPatientDashboardStats = () =>
  API.get("/patient/dashboard-stats").then((res) => res.data);

export const getUpcomingAppointments = () =>
  API.get("/patient/appointments/upcoming").then((res) => res.data);

export const getRecentTestResults = () =>
  API.get("/patient/test-results/recent").then((res) => res.data);

// ==========================
// 💬 Messages
// ==========================
export const getMessages = (userId: number) =>
  API.get(`/messages/${userId}`).then((res) => res.data);

export const getTechnicianMessages = (userId: number) =>
  API.get(`/messages/${userId}`).then((res) => res.data);

// ==========================
// 📊 Admin Dashboard
// ==========================
export const getAdminStats = () =>
  API.get("/admin/dashboard-stats").then((res) => res.data);

export const getRecentUsers = () =>
  API.get("/admin/recent-users").then((res) => res.data);

export const getLabCapacity = () =>
  API.get("/admin/lab-capacity").then((res) => res.data);

export const getAlerts = () =>
  API.get("/admin/alerts").then((res) => res.data);

export const getQRLogs = () =>
  API.get("/admin/qr-logs").then((res) => res.data);

// ==========================
// 📁 File Upload (Census)
// ==========================
export const uploadCensus = (formData: FormData) =>
  API.post("/admin/upload-census", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ==========================
// 📋 Admin – Full Data Lists
// ==========================
export const getAllPatients = () =>
  API.get("/admin/patients").then((res) => res.data);

export const getAllTests = () =>
  API.get("/admin/tests").then((res) => res.data);

export const getAllAppointments = () =>
  API.get("/admin/appointments").then((res) => res.data);

// ==========================
// 🧪 Lab Technician Dashboard
// ==========================
export const getTechnicianStats = () =>
  API.get("/labtech/dashboard-stats").then((res) => res.data);

export const getTestQueue = () =>
  API.get("/labtech/test-queue").then((res) => res.data);

export const updateTestStatus = (testId: string, status: string) =>
  API.post("/test-results", { testId, status });

// ✅ Create new test result
export const createTestResult = async (payload: {
  appointment_id: number;
  result_data: string;
  status: string;
}) => {
  const res = await API.post("/test-results", payload);
  return res.data;
};

// 🔁 Update test result status
export const updateTestResultStatus = async (resultId: number, status: string) => {
  const res = await API.put(`/test-results/${resultId}`, { status });
  return res.data;
};

// ⚠️ Workaround: Fetch test results for a patient
export const getPatientTestResults = async (patientId: number) => {
  const res = await API.get(`/patients/${patientId}/test-results`);
  return res.data;
};
