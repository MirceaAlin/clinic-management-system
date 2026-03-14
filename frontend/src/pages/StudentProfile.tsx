import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/student.css";
import "../styles/admin.css";
import { apiPut } from "../api/client";
import BackButton from "./BackButton";

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const getSaved = () => {
    try {
      const s = localStorage.getItem("studentProfile");
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  };
  const saved = getSaved();

  const [firstName, setFirstName] = useState(saved.firstName ?? currentUser.firstName ?? "");
  const [lastName,  setLastName]  = useState(saved.lastName  ?? currentUser.lastName  ?? "");
  const [email,     setEmail]     = useState(saved.email     ?? currentUser.email     ?? "");
  const [phone,     setPhone]     = useState(saved.phone     ?? "");
  const [address,   setAddress]   = useState(saved.address   ?? "");
  const [faculty,   setFaculty]   = useState(saved.faculty   ?? "");
  const [savedMsg,  setSavedMsg]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser?.id) {
        await apiPut(`/patients/${currentUser.id}`, {
          firstName,
          lastName,
          email,
          address,
          universityFaculty: faculty,
        });
      }
    } catch {
      // salvăm local chiar dacă backend-ul e indisponibil
    }

    localStorage.setItem(
      "studentProfile",
      JSON.stringify({ firstName, lastName, email, phone, address, faculty })
    );

    const updated = { ...currentUser, firstName, lastName, email };
    localStorage.setItem("currentUser", JSON.stringify(updated));

    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

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

      <h1 className="student-title">Profilul meu</h1>

      <div style={{ padding: "0 40px" }}>
        <BackButton />
      </div>

      <div className="admin-section-card" style={{ maxWidth: 800 }}>
        {savedMsg && (
          <p style={{ color: "#80ffaa", marginBottom: 14, fontSize: 14 }}>
            ✅ Profil salvat cu succes!
          </p>
        )}

        <form className="admin-form" onSubmit={saveProfile}>
          <div className="admin-form-row">
            <label>
              Prenume
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenume"
              />
            </label>
            <label>
              Nume
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nume de familie"
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@student.ro"
              />
            </label>
            <label>
              Telefon
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07xx xxx xxx"
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Adresă
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Stradă, număr, localitate"
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Facultate
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder="Facultatea de..."
              />
            </label>
          </div>

          <button className="admin-primary-btn" type="submit" disabled={saving}>
            {saving ? "Se salvează..." : "Salvează"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
