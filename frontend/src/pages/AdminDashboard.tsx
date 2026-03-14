import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/admin.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-nav-left">
          <img src={logo} className="admin-nav-logo" alt="MEDSTUD logo" />
          <span className="admin-nav-title">MEDSTUD</span>
        </div>
        <button className="admin-logout" onClick={handleLogout}>
          Ieșire
        </button>
      </div>

      <h1 className="admin-title">Administrator</h1>

      <div className="admin-grid">
        <div
          className="admin-card"
          onClick={() => navigate("/admin/users")}
          role="button"
          tabIndex={0}
        >
          <h2>👥 Gestionare utilizatori</h2>
          <p>Adaugă, editează sau șterge utilizatori din sistem</p>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/logs")}
          role="button"
          tabIndex={0}
        >
          <h2>📋 Jurnal activități</h2>
          <p>Monitorizare acces și acțiuni în sistem</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
