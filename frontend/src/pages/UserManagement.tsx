import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/studmed-logo.jpeg";
import "../styles/admin.css";
import { apiGet, apiDelete } from "../api/client";
import BackButton from "./BackButton";

interface UserBackend {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

type UserRole = "Student" | "Personal medical" | "Administrator";

interface UserLocal {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

const roleLabel = (role: string): string => {
  if (role === "PATIENT") return "Student";
  if (role === "DOCTOR")  return "Personal medical";
  if (role === "ADMIN")   return "Administrator";
  return role;
};

const UserManagement: React.FC = () => {
  const navigate = useNavigate();

  const [backendUsers, setBackendUsers] = useState<UserBackend[]>([]);
  const [localUsers, setLocalUsers] = useState<UserLocal[]>(() => {
    const stored = localStorage.getItem("adminUsers");
    return stored ? (JSON.parse(stored) as UserLocal[]) : [];
  });

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [role,       setRole]       = useState<UserRole>("Student");
  const [editingId,  setEditingId]  = useState<number | null>(null);
  const [loadError,  setLoadError]  = useState("");
  const [search,     setSearch]     = useState("");

  useEffect(() => {
    apiGet<UserBackend[]>("/users")
      .then(setBackendUsers)
      .catch(() => setLoadError("Nu s-au putut încărca utilizatorii din backend."));
  }, []);

  const saveLocalUsers = (list: UserLocal[]) => {
    setLocalUsers(list);
    localStorage.setItem("adminUsers", JSON.stringify(list));
  };

  const resetForm = () => {
    setName(""); setEmail(""); setRole("Student"); setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingId === null) {
      const newUser: UserLocal = {
        id: localUsers.length ? Math.max(...localUsers.map((u) => u.id)) + 1 : 1,
        name, email, role,
      };
      saveLocalUsers([...localUsers, newUser]);
    } else {
      saveLocalUsers(
        localUsers.map((u) => (u.id === editingId ? { ...u, name, email, role } : u))
      );
    }
    resetForm();
  };

  const handleEdit = (u: UserLocal) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setRole(u.role);
  };

  const handleDeleteLocal = (id: number) => {
    saveLocalUsers(localUsers.filter((u) => u.id !== id));
    if (editingId === id) resetForm();
  };

  const handleDeleteBackend = async (id: number) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;
    try {
      await apiDelete(`/users/${id}`);
      setBackendUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Eroare la ștergerea utilizatorului.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const filteredBackend = backendUsers.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

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

      <h1 className="admin-title">Gestionare utilizatori</h1>

      <div style={{ padding: "0 5%" }}>
        <BackButton />
      </div>

      {/* Utilizatori din backend */}
      <div className="admin-section-card">
        <h2 className="admin-subtitle">Utilizatori înregistrați în sistem</h2>

        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="🔍 Caută după nume sau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, borderRadius: 10, border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(0,0,0,0.35)", color: "#fff", padding: "9px 12px", outline: "none" }}
          />
        </div>

        {loadError && <p style={{ color: "#ff8080", marginBottom: 10 }}>{loadError}</p>}

        {backendUsers.length === 0 && !loadError ? (
          <p style={{ opacity: 0.6 }}>Se încarcă...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Prenume</th><th>Nume</th><th>Email</th><th>Rol</th><th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredBackend.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td>{roleLabel(u.role)}</td>
                  <td>
                    <button
                      className="admin-small-btn admin-delete-btn"
                      onClick={() => handleDeleteBackend(u.id)}
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Adaugă utilizator local */}
      <div className="admin-section-card">
        <h2 className="admin-subtitle">
          {editingId === null ? "Adaugă utilizator" : "Editează utilizator"}
        </h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <label>
              Nume complet
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ionescu Ana"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@studmed.ro"
              />
            </label>
          </div>
          <div className="admin-form-row">
            <label>
              Rol
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="Student">Student</option>
                <option value="Personal medical">Personal medical</option>
                <option value="Administrator">Administrator</option>
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-primary-btn">
              {editingId === null ? "Adaugă utilizator" : "Salvează modificările"}
            </button>
            {editingId !== null && (
              <button type="button" className="admin-secondary-btn" onClick={resetForm}>
                Anulează
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista utilizatorilor locali */}
      {localUsers.length > 0 && (
        <div className="admin-section-card">
          <h2 className="admin-subtitle">Lista utilizatorilor locali</h2>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nume</th><th>Email</th><th>Rol</th><th>Acțiuni</th></tr>
            </thead>
            <tbody>
              {localUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="admin-actions-cell">
                    <button className="admin-small-btn" onClick={() => handleEdit(u)}>
                      Editează
                    </button>
                    <button
                      className="admin-small-btn admin-delete-btn"
                      onClick={() => handleDeleteLocal(u.id)}
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
