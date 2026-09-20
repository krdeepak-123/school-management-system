import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { getMyTeacherClasses } from "../../services/classService";
import { getMyMaterials, addMaterial } from "../../services/materialService";
import styles from "./teacherStyles";

export default function Materials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    className: "",
    section: "",
    subject: "",
    link: "",
  });

  useEffect(() => {
    Promise.all([getMyMaterials(), getMyTeacherClasses()])
      .then(([materialData, classData]) => {
        setMaterials(materialData || []);
        setClasses(classData || []);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load study materials")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.className || !form.subject) {
      setError("Title, class and subject are required");
      return;
    }

    try {
      setSubmitting(true);
      await addMaterial({
        ...form,
        uploadedBy: user?.linkedData?.name || user?.name || "",
      });
      setSuccess("Study material shared successfully");
      setForm({
        title: "",
        description: "",
        className: "",
        section: "",
        subject: "",
        link: "",
      });
      const data = await getMyMaterials();
      setMaterials(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not share the material");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>📁 Study Materials</h1>
      <p style={styles.sub}>Share study resources with your classes.</p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Share form */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Share New Material</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Material title"
              />
            </div>
            <div>
              <label style={styles.label}>Subject</label>
              <input
                style={styles.input}
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Science"
              />
            </div>
            <div>
              <label style={styles.label}>Class</label>
              <select
                style={styles.input}
                name="className"
                value={form.className}
                onChange={(e) => {
                  const [className, section] = e.target.value.split("-");
                  setForm({ ...form, className, section: section || "" });
                }}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option
                    key={c._id}
                    value={`${c.className}${c.section ? `-${c.section}` : ""}`}
                  >
                    {c.className}
                    {c.section ? ` - Section ${c.section}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Link (URL or /uploads path)</label>
              <input
                style={styles.input}
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://... or /uploads/file.pdf"
              />
            </div>
          </div>

          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: "80px" }}
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" style={styles.btn} disabled={submitting}>
            {submitting ? "Sharing..." : "Share Material"}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Materials</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : materials.length === 0 ? (
          <p style={styles.empty}>No study materials yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Section</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m._id}>
                  <td>{m.title}</td>
                  <td>{m.subject}</td>
                  <td>{m.className}</td>
                  <td>{m.section || "-"}</td>
                  <td>
                    {m.link ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#2563eb", fontWeight: "bold" }}
                      >
                        Open →
                      </a>
                    ) : (
                      "-"
                    )}
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
