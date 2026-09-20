import { useState, useEffect } from "react";
import { getMyTeacherStudents } from "../../services/studentService";
import styles from "./teacherStyles";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyTeacherStudents()
      .then((data) => setStudents(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load students")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>👨‍🎓 My Students</h1>
      <p style={styles.sub}>Students of your assigned classes only.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Students {students.length > 0 ? `(${students.length})` : ""}
        </h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : students.length === 0 ? (
          <p style={styles.empty}>No students found in your assigned classes.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.admissionNo}</td>
                  <td>{s.name}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.className}</td>
                  <td>{s.section || "-"}</td>
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
