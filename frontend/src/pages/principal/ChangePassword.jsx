import { useState } from "react";
import { useAuth } from "../../context/auth";
import styles from "./principalStyles";

export default function ChangePassword() {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setError(
        "Password must be at least 8 characters and include both letters and numbers"
      );
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from the current password");
      return;
    }

    try {
      setSaving(true);
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not change your password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>🔑 Change Password</h1>
      <p style={styles.sub}>Update your account password.</p>

      {success && (
        <div style={styles.successBanner}>
          ✅ Password changed successfully.
        </div>
      )}
      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={{ ...styles.section, maxWidth: "480px" }}>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Current Password</label>
          <input
            style={styles.input}
            type={showPasswords ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <label style={styles.label}>New Password</label>
          <input
            style={styles.input}
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 chars, letters + numbers"
          />

          <label style={styles.label}>Confirm New Password</label>
          <input
            style={styles.input}
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
          />

          <label style={{ ...styles.label, display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPassword(!showPasswords)}
            />
            Show passwords
          </label>

          <button type="submit" style={styles.btn} disabled={saving}>
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
