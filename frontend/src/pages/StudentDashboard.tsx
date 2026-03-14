import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/student.css";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("appointments");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <div className="student-page">
      <div className="student-navbar">
        <div className="student-nav-left">
          <img src={logo} className="student-nav-logo" alt="MEDSTUD logo" />
          <span className="student-nav-title">MEDSTUD</span>
        </div>
        <button className="student-logout" onClick={handleLogout}>
          Ieșire
        </button>
      </div>

      <h1 className="student-title">
        Bun venit, {user.firstName || "Student"}!
      </h1>

      <div className="student-grid">
        <div
          className="student-card"
          onClick={() => navigate("/student/medical-file")}
          role="button"
          tabIndex={0}
        >
          <h2>🗂 Fișa medicală</h2>
          <p>Analize, diagnostice și observații medicale</p>
        </div>

        <div
          className="student-card"
          onClick={() => navigate("/student/appointments")}
          role="button"
          tabIndex={0}
        >
          <h2>📅 Programări</h2>
          <p>Vizualizează și creează programări</p>
        </div>

        <div
          className="student-card"
          onClick={() => navigate("/student/profile")}
          role="button"
          tabIndex={0}
        >
          <h2>👤 Profilul meu</h2>
          <p>Actualizează informațiile personale</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
