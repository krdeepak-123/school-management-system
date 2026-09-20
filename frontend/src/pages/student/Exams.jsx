import { useState, useEffect } from "react";
import { getMyExams } from "../../services/examService";
import styles from "./studentStyles";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyExams()
      .then((data) => setExams(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load exams")
      )
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const upcoming = exams.filter(
    (e) => new Date(e.examDate) >= today || e.status === "Upcoming"
  );
  const past = exams.filter(
    (e) => new Date(e.examDate) < today && e.status !== "Upcoming"
  );

  const renderTable = (list) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Exam ID</th>
          <th>Exam</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Time</th>
          <th>Total Marks</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map((e) => (
          <tr key={e._id}>
            <td>{e.examId}</td>
            <td>{e.name}</td>
            <td>{e.subject || "-"}</td>
            <td>{new Date(e.examDate).toLocaleDateString()}</td>
            <td>{e.startTime || "-"}</td>
            <td>{e.totalMarks}</td>
            <td>
              <span
                style={{
                  ...styles.badge,
                  background:
                    e.status === "Upcoming"
                      ? "#dbeafe"
                      : e.status === "Ongoing"
                        ? "#fef9c3"
                        : "#f1f5f9",
                  color:
                    e.status === "Upcoming"
                      ? "#1d4ed8"
                      : e.status === "Ongoing"
                        ? "#854d0e"
                        : "#475569",
                }}
              >
                {e.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1 style={styles.heading}>🧪 My Exams</h1>
      <p style={styles.sub}>Exams scheduled for your class.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming / Current Exams</h2>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : upcoming.length === 0 ? (
          <p style={styles.empty}>No upcoming exams scheduled.</p>
        ) : (
          renderTable(upcoming)
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Past Exams</h2>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : past.length === 0 ? (
          <p style={styles.empty}>No past exams.</p>
        ) : (
          renderTable(past)
        )}
      </div>
    </div>
  );
}
