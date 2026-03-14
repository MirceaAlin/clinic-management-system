import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/student.css";
import "../styles/admin.css";
import { getAnalysesByPatientId } from "../api/analyses";
import type { AnalysisItem } from "../api/analyses";
import BackButton from "./BackButton";

const StudentMedicalFile: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const patientId: number | null = user?.id ?? null;

  const [error, setError] = useState<string | null>(
    patientId ? null : "Nu ești autentificat. Te rugăm să te conectezi."
  );

  useEffect(() => {
    if (!patientId) return;

    getAnalysesByPatientId(patientId)
      .then((data) => setRecords(data))
      .catch(() => setError("Eroare la încărcarea analizelor. Verifică conexiunea la backend."))
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
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

      <h1 className="student-title">Fișa medicală</h1>

      <div style={{ padding: "0 40px" }}>
        <BackButton />
      </div>

      <div className="admin-section-card" style={{ maxWidth: 900 }}>
        {error && <p style={{ color: "#ff8080", marginBottom: 12 }}>{error}</p>}

        {loading && !error && (
          <p style={{ opacity: 0.6 }}>Se încarcă analizele...</p>
        )}

        {!loading && !error && records.length === 0 && (
          <p style={{ opacity: 0.7 }}>Nu există analize disponibile.</p>
        )}

        {!loading && !error && records.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Rezultat</th>
                <th>Unitate</th>
                <th>Interval Normal</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.testName}</td>
                  <td>{r.result}</td>
                  <td>{r.unit}</td>
                  <td>{r.normalRange}</td>
                  <td>{r.testDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentMedicalFile;
