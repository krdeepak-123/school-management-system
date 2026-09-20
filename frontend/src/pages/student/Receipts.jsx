import { useState, useEffect } from "react";
import { getMyFees } from "../../services/feeService";
import styles from "./studentStyles";

export default function Receipts() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyFees()
      .then((data) => setFees(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load receipts")
      )
      .finally(() => setLoading(false));
  }, []);

  // Receipts exist for every payment made (Paid or Partial)
  const receipts = fees.filter((f) => Number(f.paidAmount) > 0);

  const printReceipt = (f) => {
    const win = window.open("", "_blank", "width=700,height=600");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${f.feeId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            td:first-child { font-weight: bold; color: #64748b; width: 40%; }
            .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>🏫 Fee Receipt</h1>
          <table>
            <tr><td>Receipt / Fee ID</td><td>${f.feeId}</td></tr>
            <tr><td>Student</td><td>${f.studentName}</td></tr>
            <tr><td>Class</td><td>${f.className} - ${f.section}</td></tr>
            <tr><td>Total Fee</td><td>₹${Number(f.totalFee).toLocaleString()}</td></tr>
            <tr><td>Amount Paid</td><td>₹${Number(f.paidAmount).toLocaleString()}</td></tr>
            <tr><td>Balance Due</td><td>₹${Number(f.dueAmount).toLocaleString()}</td></tr>
            <tr><td>Payment Date</td><td>${new Date(f.paymentDate).toLocaleDateString()}</td></tr>
            <tr><td>Payment Mode</td><td>${f.paymentMode}</td></tr>
            <tr><td>Status</td><td>${f.status}</td></tr>
          </table>
          <p class="footer">This is a computer generated receipt. Paradise School Management System.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div>
      <h1 style={styles.heading}>🧾 Fee Receipts</h1>
      <p style={styles.sub}>Receipts for your fee payments.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : receipts.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No receipts yet. Receipts appear after a payment is recorded.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {receipts.map((f) => (
            <div style={styles.card} key={f._id}>
              <h3 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>
                🧾 {f.feeId}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>
                {new Date(f.paymentDate).toLocaleDateString()} | {f.paymentMode}
              </p>

              <div style={{ marginTop: "14px" }}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Student</span>
                  <span style={styles.infoValue}>{f.studentName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Paid</span>
                  <span style={styles.infoValue}>
                    ₹{Number(f.paidAmount).toLocaleString()}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Due</span>
                  <span style={styles.infoValue}>
                    ₹{Number(f.dueAmount).toLocaleString()}
                  </span>
                </div>
                <div style={{ ...styles.infoRow, borderBottom: "none" }}>
                  <span style={styles.infoLabel}>Status</span>
                  <span
                    style={{
                      ...styles.badge,
                      background: f.status === "Paid" ? "#dcfce7" : "#fef9c3",
                      color: f.status === "Paid" ? "#166534" : "#854d0e",
                    }}
                  >
                    {f.status}
                  </span>
                </div>
              </div>

              <button
                style={{ ...styles.btn, width: "100%", marginTop: "10px" }}
                onClick={() => printReceipt(f)}
              >
                Print Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
