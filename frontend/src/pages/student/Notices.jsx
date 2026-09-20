import { useState, useEffect } from "react";
import { getMyNotices } from "../../services/noticeService";
import styles from "./studentStyles";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyNotices()
      .then((data) => setNotices(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load notices")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>📢 Notices</h1>
      <p style={styles.sub}>Announcements from the school administration.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : notices.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No notices published yet.</p>
        </div>
      ) : (
        notices.map((n) => (
          <div style={styles.section} key={n._id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <h2 style={styles.sectionTitle}>📢 {n.title}</h2>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ margin: 0, color: "#334155", fontSize: "14px", whiteSpace: "pre-wrap" }}>
              {n.message}
            </p>
            <p style={{ margin: "12px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
              Posted by: {n.postedBy} | Audience: {n.audience}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
