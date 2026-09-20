import { useState, useEffect } from "react";
import { getMyMaterials } from "../../services/materialService";
import styles from "./studentStyles";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyMaterials()
      .then((data) => setMaterials(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load study materials")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>📁 Study Materials</h1>
      <p style={styles.sub}>Study resources shared for your class.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : materials.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No study materials shared for your class yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {materials.map((m) => (
            <div style={styles.card} key={m._id}>
              <h3 style={{ margin: 0, color: "#1e293b" }}>{m.title}</h3>
              <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "13px" }}>
                {m.subject}
              </p>
              {m.description && (
                <p style={{ margin: "10px 0 0 0", color: "#334155", fontSize: "14px" }}>
                  {m.description}
                </p>
              )}
              {m.link && (
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    color: "#2563eb",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Open Material →
                </a>
              )}
              <p style={{ margin: "10px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
                Shared by: {m.uploadedBy || "-"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
