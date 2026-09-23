import { useState, useEffect } from "react";
import API from "../../services/api";
import { useAuth, useAuthUpdate } from "../../context/auth";

import styles from "./directorStyles";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// =====================================
// DIRECTOR PROFILE
// Reuses the authenticated user from the
// same auth context every portal uses —
// shows real account data, allows editing
// harmless fields (name, mobile, address).
// =====================================

export default function DirectorProfile() {
  const { user, refreshProfile } = useAuth();
  const updateUser = useAuthUpdate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setMobile(user.mobile || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      if (typeof updateUser === "function") {
        await updateUser({ name, mobile, address });
      } else if (typeof refreshProfile === "function") {
        await refreshProfile();
      }
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>👤 Director Profile</h1>
      <p style={styles.sub}>Your director account details.</p>

      {success && <p style={{ ...styles.success, marginTop: "10px" }}>✅ Profile updated.</p>}
      {error && <p style={{ ...styles.error, marginTop: "10px" }}>{error}</p>}

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
          <span style={styles.infoValue}>{user?.role?.toUpperCase() || "DIRECTOR"}</span>
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

      <button
        type="button"
        style={styles.btn}
        onClick={() => setEditing(!editing)}
      >
        {editing ? "Cancel" : "✏️ Edit Profile"}
      </button>

      {editing && (
        <form onSubmit={handleSave} style={{ ...styles.section, marginTop: "15px", maxWidth: "420px" }}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
          <label style={styles.label}>Mobile</label>
          <input
            style={styles.input}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile number"
          />
          <label style={styles.label}>Address</label>
          <textarea
            style={{ ...styles.input, minHeight: "80px" }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button type="submit" style={styles.btn} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
