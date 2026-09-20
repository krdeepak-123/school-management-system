import { useState, useEffect } from "react";
import { getMyFees } from "../../services/feeService";
import styles from "./studentStyles";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyFees()
      .then((data) => setFees(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your fees")
      )
      .finally(() => setLoading(false));
  }, []);

  const totalFee = fees.reduce((s, f) => s + Number(f.totalFee || 0), 0);
  const totalPaid = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
  const totalDue = fees.reduce((s, f) => s + Number(f.dueAmount || 0), 0);

  return (
    <div>
      <h1 style={styles.heading}>💰 My Fees</h1>
      <p style={styles.sub}>Your fee records and payment status.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "26px", margin: 0 }}>
            {loading ? "..." : `₹${totalFee.toLocaleString()}`}
          </h3>
          <p style={styles.empty}>Total Fee</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "26px", margin: 0 }}>
            {loading ? "..." : `₹${totalPaid.toLocaleString()}`}
          </h3>
          <p style={styles.empty}>Total Paid</p>
        </div>
        <div style={styles.card}>
          <h3 style={{ ...styles.heading, fontSize: "26px", margin: 0 }}>
            {loading ? "..." : `₹${totalDue.toLocaleString()}`}
          </h3>
          <p style={styles.empty}>Pending / Due</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Fee Records</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : fees.length === 0 ? (
          <p style={styles.empty}>No fee records found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fee ID</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Payment Date</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f._id}>
                  <td>{f.feeId}</td>
                  <td>₹{f.totalFee?.toLocaleString()}</td>
                  <td>₹{f.paidAmount?.toLocaleString()}</td>
                  <td>₹{f.dueAmount?.toLocaleString()}</td>
                  <td>{new Date(f.paymentDate).toLocaleDateString()}</td>
                  <td>{f.paymentMode}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          f.status === "Paid"
                            ? "#dcfce7"
                            : f.status === "Partial"
                              ? "#fef9c3"
                              : "#fee2e2",
                        color:
                          f.status === "Paid"
                            ? "#166534"
                            : f.status === "Partial"
                              ? "#854d0e"
                              : "#991b1b",
                      }}
                    >
                      {f.status}
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
