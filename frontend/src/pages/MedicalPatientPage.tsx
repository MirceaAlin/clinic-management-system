import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/medical-patient.css";
import { apiGet, apiPost } from "../api/client";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalIdNumber?: string;
  address?: string;
  universityFaculty?: string;
}

interface Analysis {
  id: number;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  testDate: string;
}

interface Consultation {
  id: number;
  date: string;
  reason: string;
  diagnosis?: string;
  notes?: string;
  recommendations?: string;
  status: string;
  doctorName: string;
}

type ActiveTab = "analize" | "consultatii" | "date" | "adauga";

const MedicalPatientPage: React.FC = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const patientId = Number(id);

  const [patient,       setPatient]       = useState<Patient | null>(null);
  const [analyses,      setAnalyses]      = useState<Analysis[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState<ActiveTab>("analize");

  // form adaugă analiză
  const [anaTest,   setAnaTest]   = useState("");
  const [anaResult, setAnaResult] = useState("");
  const [anaUnit,   setAnaUnit]   = useState("");
  const [anaNormal, setAnaNormal] = useState("");
  const [anaDate,   setAnaDate]   = useState("");
  const [anaError,  setAnaError]  = useState("");
  const [anaSaving, setAnaSaving] = useState(false);

  // form adaugă consultație
  const [cReason, setCReason] = useState("");
  const [cDate,   setCDate]   = useState("");
  const [cDiag,   setCDiag]   = useState("");
  const [cNotes,  setCNotes]  = useState("");
  const [cRecs,   setCRecs]   = useState("");
  const [cStatus, setCStatus] = useState("Finalizată");
  const [cError,  setCError]  = useState("");
  const [cSaving, setCSaving] = useState(false);

  const currentDoctor = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    Promise.all([
      apiGet<Patient>(`/patients/${patientId}`),
      apiGet<Analysis[]>(`/analyses/patient/${patientId}`),
      apiGet<Consultation[]>(`/consultations/patient/${patientId}`),
    ])
      .then(([pat, ana, cons]) => {
        setPatient(pat);
        setAnalyses(ana);
        setConsultations(cons);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [patientId]);

  const handleAddAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnaError("");
    if (!anaTest || !anaResult || !anaDate) {
      setAnaError("Completează obligatoriu: test, rezultat și dată.");
      return;
    }
    setAnaSaving(true);
    try {
      const saved = await apiPost<Analysis, object>("/analyses", {
        testName:    anaTest,
        result:      anaResult,
        unit:        anaUnit,
        normalRange: anaNormal,
        testDate:    anaDate,
        patientId,
      });
      setAnalyses((prev) => [...prev, saved]);
      setAnaTest(""); setAnaResult(""); setAnaUnit("");
      setAnaNormal(""); setAnaDate("");
      setActiveTab("analize");
    } catch {
      setAnaError("Eroare la salvarea analizei. Verifică conexiunea.");
    } finally {
      setAnaSaving(false);
    }
  };

  const handleAddConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCError("");
    if (!cReason || !cDate) {
      setCError("Completează motivul și data.");
      return;
    }
    setCSaving(true);
    try {
      const saved = await apiPost<Consultation, object>("/consultations", {
        doctorId:  currentDoctor.id,
        patientId,
        date:      cDate,
        reason:    cReason,
      });
      // update local cu detalii complete
      const full: Consultation = {
        ...saved,
        diagnosis:       cDiag,
        notes:           cNotes,
        recommendations: cRecs,
        status:          cStatus,
        doctorName:      `${currentDoctor.firstName} ${currentDoctor.lastName}`,
      };
      setConsultations((prev) => [...prev, full]);
      setCReason(""); setCDate(""); setCDiag("");
      setCNotes(""); setCRecs(""); setCStatus("Finalizată");
      setActiveTab("consultatii");
    } catch {
      setCError("Eroare la salvarea consultației.");
    } finally {
      setCSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "100px", fontSize: 18 }}>
        Se încarcă...
      </div>
    );
  }

  const tabs: { key: ActiveTab; label: string }[] = [
    { key: "analize",     label: `Analize (${analyses.length})` },
    { key: "consultatii", label: `Consultații (${consultations.length})` },
    { key: "date",        label: "Date personale" },
    { key: "adauga",      label: "+ Adaugă" },
  ];

  return (
    <div className="medical-patient-page">
      {/* Navbar */}
      <div className="medical-navbar">
        <div className="medical-nav-left">
          <img src={logo} className="medical-nav-logo" alt="MEDSTUD logo" />
          <span className="medical-nav-title">MEDSTUD</span>
        </div>
        <button
          className="medical-logout"
          onClick={() => navigate("/medical-dashboard")}
        >
          ← Pacienți
        </button>
      </div>

      {patient && (
        <h1 className="medical-patient-title">
          {patient.firstName} {patient.lastName}
        </h1>
      )}

      {/* Tab-uri */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "9px 20px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeTab === t.key ? "#00ffff" : "rgba(255,255,255,0.25)",
              background: activeTab === t.key ? "rgba(0,255,255,0.15)" : "rgba(255,255,255,0.06)",
              color: activeTab === t.key ? "#00ffff" : "#fff",
              cursor: "pointer",
              fontSize: 14,
              transition: ".2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Analize */}
      {activeTab === "analize" && (
        <div className="medical-section">
          <h2>Analize de laborator</h2>
          {analyses.length === 0 ? (
            <p className="empty">Nu există analize înregistrate.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Test</th><th>Rezultat</th><th>Interval normal</th><th>Data</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a.id}>
                    <td>{a.testName}</td>
                    <td>{a.result} {a.unit}</td>
                    <td>{a.normalRange}</td>
                    <td>{a.testDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Consultații */}
      {activeTab === "consultatii" && (
        <div className="medical-section">
          <h2>Consultații</h2>
          {consultations.length === 0 ? (
            <p className="empty">Nu există consultații înregistrate.</p>
          ) : (
            consultations.map((c) => (
              <div key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <strong style={{ color: "#a8ffff" }}>{c.doctorName}</strong>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{
                      padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                      background: c.status === "Programată" ? "rgba(0,180,255,0.2)" : "rgba(0,255,150,0.15)",
                      color:      c.status === "Programată" ? "#80e0ff" : "#80ffb0",
                      border: "1px solid",
                      borderColor: c.status === "Programată" ? "rgba(0,180,255,0.35)" : "rgba(0,255,150,0.3)",
                    }}>
                      {c.status}
                    </span>
                    <span style={{ fontSize: 13, opacity: 0.65 }}>{c.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, marginTop: 6, opacity: 0.8 }}>{c.reason}</p>
                {c.diagnosis       && <p style={{ fontSize: 13, marginTop: 4 }}><b>Diagnostic:</b> {c.diagnosis}</p>}
                {c.notes           && <p style={{ fontSize: 13, marginTop: 4 }}><b>Observații:</b> {c.notes}</p>}
                {c.recommendations && <p style={{ fontSize: 13, marginTop: 4 }}><b>Recomandări:</b> {c.recommendations}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Date personale */}
      {activeTab === "date" && patient && (
        <div className="medical-section">
          <h2>Date personale</h2>
          <table>
            <tbody>
              <tr><td style={{ opacity: .65, width: "35%" }}>Email</td><td>{patient.email}</td></tr>
              {patient.personalIdNumber && <tr><td style={{ opacity: .65 }}>CNP</td><td>{patient.personalIdNumber}</td></tr>}
              {patient.address          && <tr><td style={{ opacity: .65 }}>Adresă</td><td>{patient.address}</td></tr>}
              {patient.universityFaculty && <tr><td style={{ opacity: .65 }}>Facultate</td><td>{patient.universityFaculty}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Adaugă */}
      {activeTab === "adauga" && (
        <>
          {/* Formular analiză */}
          <div className="medical-section">
            <h2>Adaugă analiză nouă</h2>
            {anaError && <p style={{ color: "#ff8080", marginBottom: 10, fontSize: 13 }}>{anaError}</p>}
            <form onSubmit={handleAddAnalysis} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input placeholder="Nume test *" value={anaTest}   onChange={(e) => setAnaTest(e.target.value)}
                  style={iStyle} />
                <input placeholder="Rezultat *"  value={anaResult} onChange={(e) => setAnaResult(e.target.value)}
                  style={iStyle} />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input placeholder="Unitate (ex: mg/dL)" value={anaUnit}   onChange={(e) => setAnaUnit(e.target.value)}   style={iStyle} />
                <input placeholder="Interval normal"     value={anaNormal} onChange={(e) => setAnaNormal(e.target.value)} style={iStyle} />
              </div>
              <input type="date" value={anaDate} onChange={(e) => setAnaDate(e.target.value)}
                style={{ ...iStyle, maxWidth: 220 }} />
              <button type="submit" disabled={anaSaving}
                style={{ padding: "10px 22px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#00ffff,#77ffff)", color: "#001520",
                  fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", fontSize: 14 }}>
                {anaSaving ? "Se salvează..." : "Adaugă analiză"}
              </button>
            </form>
          </div>

          {/* Formular consultație */}
          <div className="medical-section">
            <h2>Adaugă consultație</h2>
            {cError && <p style={{ color: "#ff8080", marginBottom: 10, fontSize: 13 }}>{cError}</p>}
            <form onSubmit={handleAddConsultation} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input placeholder="Motiv *" value={cReason} onChange={(e) => setCReason(e.target.value)} style={iStyle} />
                <input type="date" value={cDate} onChange={(e) => setCDate(e.target.value)} style={iStyle} />
              </div>
              <input placeholder="Diagnostic"      value={cDiag}  onChange={(e) => setCDiag(e.target.value)}  style={iStyle} />
              <textarea placeholder="Observații"   value={cNotes} onChange={(e) => setCNotes(e.target.value)}
                rows={2} style={{ ...iStyle, resize: "vertical" }} />
              <textarea placeholder="Recomandări"  value={cRecs}  onChange={(e) => setCRecs(e.target.value)}
                rows={2} style={{ ...iStyle, resize: "vertical" }} />
              <select value={cStatus} onChange={(e) => setCStatus(e.target.value)}
                style={{ ...iStyle, maxWidth: 220 }}>
                <option value="Finalizată">Finalizată</option>
                <option value="Programată">Programată</option>
              </select>
              <button type="submit" disabled={cSaving}
                style={{ padding: "10px 22px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg,#00ffff,#77ffff)", color: "#001520",
                  fontWeight: 700, cursor: "pointer", alignSelf: "flex-start", fontSize: 14 }}>
                {cSaving ? "Se salvează..." : "Adaugă consultație"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

const iStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  background: "rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 10,
  color: "#fff",
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
};

export default MedicalPatientPage;
