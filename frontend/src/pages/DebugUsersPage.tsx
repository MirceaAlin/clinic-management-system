import React, { useEffect, useState } from "react";
import { apiGet } from "../api/client";

interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const DebugUsersPage: React.FC = () => {
  const [users,   setUsers]   = useState<UserDTO[]>([]);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<UserDTO[]>("/users")
      .then((data) => setUsers(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "monospace", color: "#e0e0e0", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20, color: "#00ffff" }}>🛠 Debug: Utilizatori din backend</h1>

      {loading && <p>Se încarcă...</p>}
      {error   && <p style={{ color: "#ff8080" }}>Eroare: {error}</p>}

      {!loading && !error && (
        <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", borderColor: "#444" }}>
          <thead>
            <tr style={{ background: "#1a1a1a" }}>
              <th>ID</th><th>Prenume</th><th>Nume</th><th>Email</th><th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ background: "#1e1e1e" }}>
                <td>{u.id}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.email}</td>
                <td style={{ color: u.role === "ADMIN" ? "#ffdd80" : u.role === "DOCTOR" ? "#80ff90" : "#80eeff" }}>
                  {u.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 24, fontSize: 12, opacity: 0.5 }}>
        Această pagină este vizibilă doar în modul development (DEV).
      </div>
    </div>
  );
};

export default DebugUsersPage;
