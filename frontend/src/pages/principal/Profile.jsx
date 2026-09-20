import { useAuth } from "../../context/auth";
import styles from "./principalStyles";

// =====================================
// PRINCIPAL PROFILE
// Reuses the authenticated user object
// from the auth context (single source
// of truth) — no duplicate API call.
// =====================================

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={styles.heading}>👤 My Profile</h1>
      <p style={styles.sub}>Your principal account details.</p>

      <div style={styles.section}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Name</span>
          <span style={styles.infoValue}>{user?.name || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Email</span>
          <span style={styles.infoValue}>{user?.email || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Role</span>
          <span style={styles.infoValue}>{user?.role?.toUpperCase() || "PRINCIPAL"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Mobile</span>
          <span style={styles.infoValue}>{user?.mobile || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Address</span>
          <span style={styles.infoValue}>{user?.address || "-"}</span>
        </div>
      </div>
    </div>
  );
}
