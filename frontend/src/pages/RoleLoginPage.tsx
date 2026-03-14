import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/login.css";
import { loginRequest } from "../api/auth";

const roleLabels: Record<string, string> = {
  student:  "Student – Pacient",
  personal: "Personal medical",
  admin:    "Administrator",
};

const RoleLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Te rugăm să completezi email-ul și parola.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginRequest(email, password);

      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(user));

      const roleMap: Record<string, string> = {
        student:  "PATIENT",
        personal: "DOCTOR",
        admin:    "ADMIN",
      };

      if (roleId && user.role === roleMap[roleId]) {
        if (user.role === "PATIENT") navigate("/student-dashboard");
        else if (user.role === "DOCTOR") navigate("/medical-dashboard");
        else navigate("/admin-dashboard");
      } else {
        localStorage.removeItem("currentUser");
        setErrorMsg("Contul nu corespunde tipului ales. Selectează rolul corect.");
      }
    } catch {
      setErrorMsg("Email sau parolă greșită.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-navbar">
        <img src={logo} className="login-navbar-logo" alt="MEDSTUD logo" />
        <span className="login-navbar-title">MEDSTUD</span>
      </div>

      <div className="login-center">
        <button className="login-back" onClick={() => navigate(-1)}>
          ← Înapoi
        </button>

        <h1 className="login-main-title">Conectează-te</h1>
        {roleId && (
          <p style={{ opacity: 0.65, marginBottom: 20, fontSize: 15 }}>
            {roleLabels[roleId] ?? roleId}
          </p>
        )}

        <div className="login-form-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {errorMsg && (
              <p style={{ color: "#ff7070", marginBottom: 8, fontSize: 14 }}>
                {errorMsg}
              </p>
            )}

            <label className="login-field-glass">
              <span>Adresă de e-mail</span>
              <input
                type="email"
                value={email}
                placeholder="exemplu@studmed.ro"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="login-field-glass">
              <span>Parolă</span>
              <div className="password-row">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Introduceți parola"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-glass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Ascunde parola" : "Arată parola"}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            <div className="login-forgot-link">Am uitat parola</div>

            <button
              type="submit"
              className="login-submit-glass-btn"
              disabled={loading}
            >
              {loading ? "Se conectează..." : "Conectează-te"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleLoginPage;
