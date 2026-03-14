import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/admin.css";
import BackButton from "./BackButton";

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  details: string;
}

const SEED_LOGS: LogEntry[] = [
  { id: 1, timestamp: "2025-11-10 09:15", action: "Autentificare",      details: "patient@studmed.ro s-a conectat (PATIENT)" },
  { id: 2, timestamp: "2025-11-10 09:18", action: "Vizualizare analize", details: "Ana Ionescu a accesat fișa medicală" },
  { id: 3, timestamp: "2025-11-09 14:32", action: "Programare creată",   details: "Programare nouă pentru Ana Ionescu la Dr. Maria Popa" },
  { id: 4, timestamp: "2025-11-08 11:05", action: "Autentificare",       details: "doctor@studmed.ro s-a conectat (DOCTOR)" },
  { id: 5, timestamp: "2025-11-08 11:10", action: "Vizualizare pacient", details: "Dr. Popa a accesat fișa lui Mihai Popescu" },
  { id: 6, timestamp: "2025-11-07 16:45", action: "Analiză adăugată",    details: "Hemogramă adăugată pentru Ana Ionescu" },
  { id: 7, timestamp: "2025-11-06 10:00", action: "Autentificare",       details: "admin@studmed.ro s-a conectat (ADMIN)" },
  { id: 8, timestamp: "2025-11-06 10:05", action: "Gestionare utilizatori", details: "Admin a accesat modulul de utilizatori" },
];

const ActivityLog: React.FC = () => {
  const navigate = useNavigate();

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const storedLog = localStorage.getItem("activityLog");
    if (storedLog) {
      try {
        const parsed = JSON.parse(storedLog) as LogEntry[];
        return parsed.length > 0 ? parsed : SEED_LOGS;
      } catch {
        return SEED_LOGS;
      }
    }
    return SEED_LOGS;
  });

  const [search, setSearch] = useState("");

  const clearLog = () => {
    localStorage.removeItem("activityLog");
    setLogs([]);
  };

  const filtered = logs.filter((l) =>
    `${l.action} ${l.details} ${l.timestamp}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <div className="admin-nav-left">
          <img src={logo} className="admin-nav-logo" alt="MEDSTUD logo" />
          <span className="admin-nav-title">MEDSTUD</span>
        </div>
        <button
          className="admin-logout"
          onClick={() => {
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
        >
          Ieșire
        </button>
      </div>

      <h1 className="admin-title">Jurnal activități</h1>

      <div style={{ padding: "0 5%" }}>
        <BackButton />
      </div>

      <div className="admin-section-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h2 className="admin-subtitle" style={{ margin: 0 }}>
            Activitate sistem ({logs.length} intrări)
          </h2>
          {logs.length > 0 && (
            <button className="admin-secondary-btn admin-clear-log" onClick={clearLog}>
              Șterge jurnalul
            </button>
          )}
        </div>

        <div className="admin-form-row" style={{ marginBottom: 14 }}>
          <input
            type="text"
            placeholder="🔍 Caută în jurnal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(0,0,0,0.35)", color: "#fff", padding: "9px 12px", outline: "none" }}
          />
        </div>

        {filtered.length === 0 ? (
          <p style={{ opacity: 0.65 }}>
            {logs.length === 0 ? "Nu există activități înregistrate." : "Nicio intrare nu corespunde căutării."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Data și ora</th>
                <th>Acțiune</th>
                <th>Detalii</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap", opacity: 0.8 }}>
                    {log.timestamp}
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 600 }}>{log.action}</td>
                  <td style={{ fontSize: 13, opacity: 0.8 }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
