import { useState, useEffect } from "react";
import { getMyAssignments } from "../../services/assignmentService";
import styles from "./studentStyles";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyAssignments()
      .then((data) => setAssignments(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load assignments")
      )
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h1 style={styles.heading}>📚 Assignments</h1>
      <p style={styles.sub}>Assignments given to your class.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : assignments.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No assignments for your class yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {assignments.map((a) => {
            const due = new Date(a.dueDate);
            const overdue = due < today;
            return (
              <div style={styles.card} key={a._id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "flex-start" }}>
                  <h3 style={{ margin: 0, color: "#1e293b" }}>{a.title}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      background: overdue ? "#fee2e2" : "#dcfce7",
                      color: overdue ? "#991b1b" : "#166534",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {overdue ? "Overdue" : "Open"}
                  </span>
                </div>
                <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "13px" }}>
                  {a.subject} | Due: {due.toLocaleDateString()}
                </p>
                {a.description && (
                  <p style={{ margin: "10px 0 0 0", color: "#334155", fontSize: "14px" }}>
                    {a.description}
                  </p>
                )}
                <p style={{ margin: "10px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
                  Assigned by: {a.assignedBy || "-"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
