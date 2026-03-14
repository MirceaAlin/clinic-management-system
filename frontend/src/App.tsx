import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RoleLoginPage from "./pages/RoleLoginPage";

import StudentDashboard from "./pages/StudentDashboard";
import StudentMedicalFile from "./pages/StudentMedicalFile";
import StudentAppointments from "./pages/StudentAppointments";
import StudentProfile from "./pages/StudentProfile";

import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import ActivityLog from "./pages/ActivityLog";

import MedicalDashboard from "./pages/MedicalDashboard";
import MedicalPatientPage from "./pages/MedicalPatientPage";

import AnalysisPage from "./pages/AnalysisPage";
import DebugUsersPage from "./pages/DebugUsersPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "PATIENT") return <Navigate to="/student-dashboard" replace />;
    if (user.role === "DOCTOR")  return <Navigate to="/medical-dashboard"  replace />;
    if (user.role === "ADMIN")   return <Navigate to="/admin-dashboard"    replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const isDev = import.meta.env.DEV;

  return (
    <>
      {isDev && (
        <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
          <a
            href="/debug-users"
            style={{
              padding: "8px 14px",
              background: "#222",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            DEBUG USERS
          </a>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:roleId" element={<RoleLoginPage />} />

        {/* Student / Pacient */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole="PATIENT"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/medical-file" element={
          <ProtectedRoute requiredRole="PATIENT"><StudentMedicalFile /></ProtectedRoute>
        } />
        <Route path="/student/appointments" element={
          <ProtectedRoute requiredRole="PATIENT"><StudentAppointments /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute requiredRole="PATIENT"><StudentProfile /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="ADMIN"><UserManagement /></ProtectedRoute>
        } />
        <Route path="/admin/logs" element={
          <ProtectedRoute requiredRole="ADMIN"><ActivityLog /></ProtectedRoute>
        } />

        {/* Doctor */}
        <Route path="/medical-dashboard" element={
          <ProtectedRoute requiredRole="DOCTOR"><MedicalDashboard /></ProtectedRoute>
        } />
        <Route path="/medical/patient/:id" element={
          <ProtectedRoute requiredRole="DOCTOR"><MedicalPatientPage /></ProtectedRoute>
        } />

        {/* Analize (acces general autentificat) */}
        <Route path="/analyses" element={
          <ProtectedRoute><AnalysisPage /></ProtectedRoute>
        } />

        {isDev && <Route path="/debug-users" element={<DebugUsersPage />} />}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
