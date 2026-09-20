import { useState, useEffect } from "react";
import { getMyClass } from "../../services/classService";
import styles from "./studentStyles";

export default function Classes() {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyClass()
      .then((data) => setClassData(data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your class")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={styles.heading}>📚 My Classes</h1>
      <p style={styles.sub}>The class you are enrolled in.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : !classData ? (
        <div style={styles.section}>
          <p style={styles.empty}>No class record found for your enrollment.</p>
        </div>
      ) : (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {classData.className}
            {classData.section ? ` - Section ${classData.section}` : ""}
          </h2>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Class ID</span>
            <span style={styles.infoValue}>{classData.classId}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Class Teacher</span>
            <span style={styles.infoValue}>{classData.classTeacher || "-"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Room No</span>
            <span style={styles.infoValue}>{classData.roomNo || "-"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Capacity</span>
            <span style={styles.infoValue}>{classData.capacity || "-"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status</span>
            <span style={styles.infoValue}>{classData.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
