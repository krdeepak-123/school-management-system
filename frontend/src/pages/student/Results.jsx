import { useState, useEffect } from "react";
import { getMyResults } from "../../services/resultService";
import styles from "./studentStyles";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyResults()
      .then((data) => setResults(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your results")
      )
      .finally(() => setLoading(false));
  }, []);

  const passCount = results.filter((r) => r.status === "Pass").length;
  const avgPercent =
    results.length > 0
      ? Math.round(
          results.reduce((s, r) => s + Number(r.percentage || 0), 0) /
            results.length
        )
      : 0;

  return (
    <div>
      <h1 style={styles.heading}>📝 My Results</h1>
      <p style={styles.sub}>Your exam results, published by the school.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : results.length}
          </h3>
          <p style={styles.empty}>Total Results</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : passCount}
          </h3>
          <p style={styles.empty}>Passed</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "32px", margin: 0 }}>
            {loading ? "..." : `${avgPercent}%`}
          </h3>
          <p style={styles.empty}>Average Percentage</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>All Results</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : results.length === 0 ? (
          <p style={styles.empty}>No results published yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Result ID</th>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Exam Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id}>
                  <td>{r.resultId}</td>
                  <td>{r.exam}</td>
                  <td>{r.subject}</td>
                  <td>
                    {r.obtainedMarks}/{r.totalMarks}
                  </td>
                  <td>{r.percentage}%</td>
                  <td>{r.grade}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background: r.status === "Pass" ? "#dcfce7" : "#fee2e2",
                        color: r.status === "Pass" ? "#166534" : "#991b1b",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.examDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
