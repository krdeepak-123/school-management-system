import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { getMyTeacherClasses, getClasses } from "../../services/classService";
import { getExams, addExam, updateExam } from "../../services/examService";
import styles from "./teacherStyles";

export default function Exams() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    className: "",
    section: "",
    subject: "",
    examDate: "",
    startTime: "",
    totalMarks: 100,
  });

  useEffect(() => {
    // Teachers see only their assigned classes; other
    // staff see all classes (same split as the API)
    const isTeacher = user?.role === "teacher";
    Promise.all([getExams(), isTeacher ? getMyTeacherClasses() : getClasses()])
      .then(([examData, classRes]) => {
        setExams(examData || []);
        setClasses(Array.isArray(classRes) ? classRes : classRes?.data?.data || []);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load exams")
      )
      .finally(() => setLoading(false));
  }, [user?.role]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.className || !form.examDate) {
      setError("Exam name, class and exam date are required");
      return;
    }

    try {
      setSubmitting(true);
      await addExam(form);
      setSuccess("Exam created successfully");
      setForm({
        name: "",
        className: "",
        section: "",
        subject: "",
        examDate: "",
        startTime: "",
        totalMarks: 100,
      });
      const data = await getExams();
      setExams(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the exam");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (exam, newStatus) => {
    setError("");
    setSuccess("");

    try {
      await updateExam(exam._id, { status: newStatus });
      setSuccess(`Updated ${exam.name}'s status`);
      const data = await getExams();
      setExams(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update the exam");
    }
  };

  const today = new Date();
  const upcoming = exams.filter(
    (e) => new Date(e.examDate) >= today || e.status === "Upcoming"
  );
  const past = exams.filter(
    (e) => new Date(e.examDate) < today && e.status !== "Upcoming"
  );

  const renderTable = (list) => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Exam ID</th>
          <th>Exam</th>
          <th>Subject</th>
          <th>Class</th>
          <th>Date</th>
          <th>Time</th>
          <th>Total Marks</th>
          <th>Status</th>
          <th>Set Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map((e) => (
          <tr key={e._id}>
            <td>{e.examId}</td>
            <td>{e.name}</td>
            <td>{e.subject || "-"}</td>
            <td>
              {e.className}
              {e.section ? ` - ${e.section}` : ""}
            </td>
            <td>{new Date(e.examDate).toLocaleDateString()}</td>
            <td>{e.startTime || "-"}</td>
            <td>{e.totalMarks}</td>
            <td>{e.status}</td>
            <td>
              {["Upcoming", "Ongoing", "Completed"]
                .filter((st) => st !== e.status)
                .map((st) => (
                  <button
                    key={st}
                    style={{ ...styles.btnSecondary, padding: "4px 10px", marginRight: "6px" }}
                    onClick={() => handleStatusChange(e, st)}
                  >
                    {st}
                  </button>
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1 style={styles.heading}>🧪 Exams</h1>
      <p style={styles.sub}>
        Create exams and manage exam schedules.
      </p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Create form */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>New Exam</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Exam Name</label>
              <input
                style={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Unit Test 1"
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
              <label style={styles.label}>Subject</label>
              <input
                style={styles.input}
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. English"
              />
            </div>
            <div>
              <label style={styles.label}>Exam Date</label>
              <input
                style={styles.input}
                name="examDate"
                type="date"
                value={form.examDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={styles.label}>Start Time</label>
              <input
                style={styles.input}
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                placeholder="e.g. 09:00 AM"
              />
            </div>
            <div>
              <label style={styles.label}>Total Marks</label>
              <input
                style={styles.input}
                name="totalMarks"
                type="number"
                value={form.totalMarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" style={styles.btn} disabled={submitting}>
            {submitting ? "Creating..." : "Create Exam"}
          </button>
        </form>
      </div>

      {/* Lists */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Upcoming / Current Exams</h2>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : upcoming.length === 0 ? (
          <p style={styles.empty}>No upcoming exams.</p>
        ) : (
          renderTable(upcoming)
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Past Exams</h2>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : past.length === 0 ? (
          <p style={styles.empty}>No past exams.</p>
        ) : (
          renderTable(past)
        )}
      </div>
    </div>
  );
}
