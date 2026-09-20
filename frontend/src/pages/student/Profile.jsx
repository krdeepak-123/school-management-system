import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { getMyProfile, updateMyProfile } from "../../services/studentService";
import styles from "./studentStyles";

export default function Profile() {
  const { refreshProfile } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        setMobile(data.mobile || "");
        setAddress(data.address || "");
        setPhotoPreview(data.photo ? `/${data.photo}` : "");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your profile")
      )
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      setSaving(true);
      const updated = await updateMyProfile({ mobile, address, photo });
      setProfile(updated);
      setPhotoPreview(updated.photo ? `/${updated.photo}` : "");
      setPhoto(null);
      setEditing(false);
      setSuccess(true);
      refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={styles.empty}>Loading profile...</p>;
  }

  if (!profile) {
    return (
      <div>
        <h1 style={styles.heading}>👤 My Profile</h1>
        <div style={styles.section}>
          <p style={styles.errorBanner}>{error || "No profile data found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.heading}>👤 My Profile</h1>
      <p style={styles.sub}>View your details and edit permitted information.</p>

      {success && (
        <div style={styles.successBanner}>✅ Profile updated successfully</div>
      )}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Identity card */}
      <div style={{ ...styles.section, display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
        {photoPreview ? (
          <img src={photoPreview} alt="Profile" style={styles.photoPreview} />
        ) : (
          <div style={styles.photoPlaceholder}>
            {profile.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>{profile.name}</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b" }}>
            Admission No: <strong>{profile.admissionNo}</strong> | Roll No:{" "}
            <strong>{profile.rollNo}</strong>
          </p>
        </div>
      </div>

      {/* Read-only details */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Student Information</h2>

        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Class</span>
          <span style={styles.infoValue}>{profile.className}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Section</span>
          <span style={styles.infoValue}>{profile.section || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Father's Name</span>
          <span style={styles.infoValue}>{profile.fatherName || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Mother's Name</span>
          <span style={styles.infoValue}>{profile.motherName || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Date of Birth</span>
          <span style={styles.infoValue}>
            {profile.dob ? new Date(profile.dob).toLocaleDateString() : "-"}
          </span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Gender</span>
          <span style={styles.infoValue}>{profile.gender || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Email</span>
          <span style={styles.infoValue}>{profile.email || "-"}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Status</span>
          <span style={styles.infoValue}>{profile.status}</span>
        </div>
      </div>

      {/* Editable section */}
      <div style={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={styles.sectionTitle}>Editable Information</h2>
          <button
            style={editing ? styles.btnSecondary : styles.btn}
            onClick={() => {
              setEditing(!editing);
              setError("");
              setSuccess(false);
            }}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave}>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Mobile Number</label>
                <input
                  style={styles.input}
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-15 digits"
                />
              </div>
              <div>
                <label style={styles.label}>Photo</label>
                <input
                  style={styles.input}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <label style={styles.label}>Address</label>
            <textarea
              style={{ ...styles.input, minHeight: "80px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button type="submit" style={styles.btn} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Mobile</span>
              <span style={styles.infoValue}>{profile.mobile || "-"}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Address</span>
              <span style={styles.infoValue}>{profile.address || "-"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
