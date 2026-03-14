import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/medical.css";
import { apiGet } from "../api/client";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const MedicalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search,   setSearch]   = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    apiGet<Patient[]>("/patients")
      .then((data) => setPatients(data))
      .catch(() => setError("Eroare la încărcarea pacienților. Verifică conexiunea la backend."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="medical-page">
      <div className="medical-navbar">
        <div className="medical-nav-left">
          <img src={logo} className="medical-nav-logo" alt="MEDSTUD logo" />
          <span className="medical-nav-title">MEDSTUD</span>
        </div>
        <button className="medical-logout" onClick={handleLogout}>
          Ieșire
        </button>
      </div>

      <h1 className="medical-title">Selectează pacient</h1>

      {error && (
        <p style={{ color: "#ff8080", textAlign: "center", marginTop: 20 }}>{error}</p>
      )}

      <div className="medical-search-container">
        <input
          type="text"
          className="medical-search"
          placeholder="🔍 Caută pacient după nume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="patient-list">
        {loading && !error && (
          <p className="no-results">Se încarcă pacienții...</p>
        )}

        {!loading && filtered.length === 0 && patients.length > 0 && (
          <p className="no-results">Niciun pacient găsit pentru „{search}".</p>
        )}

        {!loading && patients.length === 0 && !error && (
          <p className="no-results">Nu există pacienți înregistrați.</p>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className="patient-card"
            onClick={() => navigate(`/medical/patient/${p.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/medical/patient/${p.id}`)}
          >
            <h2>{p.firstName} {p.lastName}</h2>
            <p>{p.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalDashboard;
