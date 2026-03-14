import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/student.css";
import "../styles/admin.css";
import { getDoctors } from "../api/doctors";
import type { Doctor } from "../api/doctors";
import { apiPost } from "../api/client";
import BackButton from "./BackButton";

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  reason: string;
}

const StudentAppointments: React.FC = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = localStorage.getItem("appointments");
    return stored ? (JSON.parse(stored) as Appointment[]) : [];
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const student = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    getDoctors().then(setDoctors).catch(console.error);
  }, []);

  const saveLocalAppointment = (a: Appointment) => {
    const updated = [...appointments, a];
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!date || !doctorId) {
      setErrorMsg("Te rugăm să selectezi data și medicul.");
      return;
    }

    if (!student?.id) {
      setErrorMsg("Nu ești autentificat. Te rugăm să te conectezi.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/consultations", {
        doctorId: Number(doctorId),
        patientId: student.id,
        date,
        reason: reason || "Programare medicală",
      });

      const doc = doctors.find((d) => d.id === Number(doctorId));
      saveLocalAppointment({
        id: Date.now(),
        date,
        time,
        doctor: `${doc?.firstName} ${doc?.lastName} (${doc?.specialization})`,
        reason: reason || "Programare medicală",
      });

      setDate("");
      setTime("");
      setDoctorId("");
      setReason("");
      setSuccessMsg("Programare trimisă cu succes!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Eroare la trimiterea programării. Verifică conexiunea.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const today = new Date().toISOString().split("T")[0];

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

      <h1 className="student-title">Programările mele</h1>

      <div style={{ padding: "0 40px" }}>
        <BackButton />
      </div>

      {/* Formular programare nouă */}
      <div className="admin-section-card">
        <h2 className="admin-subtitle">Programare nouă</h2>

        {errorMsg   && <p style={{ color: "#ff8080", marginBottom: 10, fontSize: 14 }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "#80ffaa", marginBottom: 10, fontSize: 14 }}>✅ {successMsg}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>
              Medic
              <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                <option value="">Selectează medicul</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.firstName} {d.lastName} – {d.specialization}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Data
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Ora
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Motiv consultație
              <input
                type="text"
                value={reason}
                placeholder="ex: Control periodic, dureri..."
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
          </div>

          <button className="admin-primary-btn" type="submit" disabled={loading}>
            {loading ? "Se trimite..." : "Programează"}
          </button>
        </form>
      </div>

      {/* Lista programărilor locale */}
      <div className="admin-section-card">
        <h2 className="admin-subtitle">Programările mele</h2>
        {appointments.length === 0 ? (
          <p style={{ opacity: 0.65 }}>Nu ai programări înregistrate.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Ora</th>
                <th>Medic</th>
                <th>Motiv</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.date}</td>
                  <td>{app.time || "—"}</td>
                  <td>{app.doctor}</td>
                  <td>{app.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentAppointments;
