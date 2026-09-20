import { useState, useEffect } from "react";
import { applyLeave, getMyLeaves } from "../../services/leaveService";
import styles from "./studentStyles";

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const load = () => {
    getMyLeaves()
      .then((data) => setLeaves(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your leave applications")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fromDate || !toDate || !reason.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);
      await applyLeave({ fromDate, toDate, reason: reason.trim() });
      setSuccess("Leave application submitted successfully");
      setFromDate("");
      setToDate("");
      setReason("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>🗓️ Leave Application</h1>
      <p style={styles.sub}>Apply for leave and track your applications.</p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>New Leave Application</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>From Date</label>
              <input
                style={styles.input}
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label style={styles.label}>To Date</label>
              <input
                style={styles.input}
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <label style={styles.label}>Reason</label>
          <textarea
            style={{ ...styles.input, minHeight: "90px" }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for leave"
          />

          <button type="submit" style={styles.btn} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Applications</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : leaves.length === 0 ? (
          <p style={styles.empty}>You have not applied for leave yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id}>
                  <td>{l.leaveId}</td>
                  <td>{new Date(l.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(l.toDate).toLocaleDateString()}</td>
                  <td>{l.reason}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          l.status === "Approved"
                            ? "#dcfce7"
                            : l.status === "Rejected"
                              ? "#fee2e2"
                              : "#fef9c3",
                        color:
                          l.status === "Approved"
                            ? "#166534"
                            : l.status === "Rejected"
                              ? "#991b1b"
                              : "#854d0e",
                      }}
                    >
                      {l.status}
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
