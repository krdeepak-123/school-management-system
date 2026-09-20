import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { getMyTeacherClasses } from "../../services/classService";
import { getMyAssignments, addAssignment } from "../../services/assignmentService";
import styles from "./teacherStyles";

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
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
    dueDate: "",
  });

  useEffect(() => {
    Promise.all([getMyAssignments(), getMyTeacherClasses()])
      .then(([assignmentData, classData]) => {
        setAssignments(assignmentData || []);
        setClasses(classData || []);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load assignments")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.className || !form.subject || !form.dueDate) {
      setError("Title, class, subject and due date are required");
      return;
    }

    try {
      setSubmitting(true);
      await addAssignment({
        ...form,
        assignedBy: user?.linkedData?.name || user?.name || "",
      });
      setSuccess("Assignment created successfully");
      setForm({
        title: "",
        description: "",
        className: "",
        section: "",
        subject: "",
        dueDate: "",
      });
      const data = await getMyAssignments();
      setAssignments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <h1 style={styles.heading}>📚 Assignments</h1>
      <p style={styles.sub}>Create assignments and manage them for your classes.</p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Create form */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>New Assignment</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Assignment title"
              />
            </div>
            <div>
              <label style={styles.label}>Subject</label>
              <input
                style={styles.input}
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Mathematics"
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
              <label style={styles.label}>Due Date</label>
              <input
                style={styles.input}
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: "80px" }}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Assignment details"
          />

          <button type="submit" style={styles.btn} disabled={submitting}>
            {submitting ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Assignments</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : assignments.length === 0 ? (
          <p style={styles.empty}>No assignments yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Section</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const overdue = new Date(a.dueDate) < today;
                return (
                  <tr key={a._id}>
                    <td>{a.title}</td>
                    <td>{a.subject}</td>
                    <td>{a.className}</td>
                    <td>{a.section || "-"}</td>
                    <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        style={{
                          ...styles.badge,
                          background: overdue ? "#fee2e2" : "#dcfce7",
                          color: overdue ? "#991b1b" : "#166534",
                        }}
                      >
                        {overdue ? "Overdue" : "Open"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
