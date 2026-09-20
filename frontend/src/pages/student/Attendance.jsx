import { useState, useEffect } from "react";
import { getMyAttendance } from "../../services/attendanceService";
import styles from "./studentStyles";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyAttendance()
      .then((data) => setRecords(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load attendance")
      )
      .finally(() => setLoading(false));
  }, []);

  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const late = records.filter((r) => r.status === "Late").length;
  const percent =
    records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  return (
    <div>
      <h1 style={styles.heading}>📅 My Attendance</h1>
      <p style={styles.sub}>Your attendance record for the current session.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : `${percent}%`}
          </h3>
          <p style={styles.empty}>Attendance Percentage</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : records.length}
          </h3>
          <p style={styles.empty}>Total Days Recorded</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : present}
          </h3>
          <p style={styles.empty}>Present</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : absent}
          </h3>
          <p style={styles.empty}>Absent</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : late}
          </h3>
          <p style={styles.empty}>Late</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Attendance Records</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : records.length === 0 ? (
          <p style={styles.empty}>No attendance records found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.className}</td>
                  <td>{r.section}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          r.status === "Present"
                            ? "#dcfce7"
                            : r.status === "Absent"
                              ? "#fee2e2"
                              : "#fef9c3",
                        color:
                          r.status === "Present"
                            ? "#166534"
                            : r.status === "Absent"
                              ? "#991b1b"
                              : "#854d0e",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
