import { useState, useEffect } from "react";
import { getMySubjects } from "../../services/subjectService";
import styles from "./studentStyles";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMySubjects()
      .then((data) => setSubjects(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load subjects")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>📖 My Subjects</h1>
      <p style={styles.sub}>Subjects taught in your class.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Subjects</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : subjects.length === 0 ? (
          <p style={styles.empty}>No subjects assigned to your class yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id}>
                  <td>{s.subjectId}</td>
                  <td>{s.name}</td>
                  <td>{s.teacher || "-"}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
