import { useState, useEffect } from "react";
import { getMyTeacherClasses } from "../../services/classService";
import styles from "./teacherStyles";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyTeacherClasses()
      .then((data) => setClasses(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your classes")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>📚 My Classes</h1>
      <p style={styles.sub}>Classes assigned to you as class teacher.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Assigned Classes</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : classes.length === 0 ? (
          <p style={styles.empty}>No classes are assigned to you yet. Contact administration.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Class</th>
                <th>Section</th>
                <th>Room No</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c._id}>
                  <td>{c.classId}</td>
                  <td>{c.className}</td>
                  <td>{c.section}</td>
                  <td>{c.roomNo || "-"}</td>
                  <td>{c.capacity || "-"}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
