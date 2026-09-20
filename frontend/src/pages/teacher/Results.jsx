import { useState, useEffect } from "react";
import { getMyTeacherClasses } from "../../services/classService";
import { getMyTeacherStudents } from "../../services/studentService";
import { getMyTeacherResults, addResult, updateResult } from "../../services/resultService";
import styles from "./teacherStyles";

export default function Results() {
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editMarks, setEditMarks] = useState("");
  const [editTotal, setEditTotal] = useState("");

  const [form, setForm] = useState({
    student: "",
    exam: "",
    subject: "",
    totalMarks: 100,
    obtainedMarks: "",
    examDate: "",
  });

  const loadResults = () => {
    getMyTeacherResults()
      .then((data) => setResults(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load results")
      );
  };

  useEffect(() => {
    Promise.all([getMyTeacherClasses(), getMyTeacherStudents()])
      .then(([classData, studentData]) => {
        setClasses(classData || []);
        setStudents(studentData || []);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your classes")
      )
      .finally(() => {
        setLoading(false);
        loadResults();
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectedStudent = students.find((s) => s._id === form.student);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedStudent) {
      setError("Please select a student");
      return;
    }
    if (!form.exam || !form.subject || form.obtainedMarks === "") {
      setError("Exam, subject and obtained marks are required");
      return;
    }

    try {
      setSubmitting(true);
      await addResult({
        studentName: selectedStudent.name,
        className: selectedStudent.className,
        section: selectedStudent.section || "",
        rollNo: selectedStudent.rollNo,
        exam: form.exam,
        subject: form.subject,
        totalMarks: form.totalMarks,
        obtainedMarks: form.obtainedMarks,
        examDate: form.examDate || new Date().toISOString().slice(0, 10),
      });
      setSuccess(`Marks entered for ${selectedStudent.name}`);
      setForm({ ...form, student: "", obtainedMarks: "" });
      loadResults();
    } catch (err) {
      setError(err.response?.data?.message || "Could not enter marks");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setEditMarks(String(r.obtainedMarks));
    setEditTotal(String(r.totalMarks));
    setError("");
    setSuccess("");
  };

  const saveEdit = async (r) => {
    setError("");
    setSuccess("");

    if (editMarks === "" || editTotal === "") {
      setError("Marks values are required");
      return;
    }

    try {
      await updateResult(r._id, {
        totalMarks: Number(editTotal),
        obtainedMarks: Number(editMarks),
      });
      setSuccess(`Updated ${r.studentName}'s marks`);
      setEditingId(null);
      loadResults();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update marks");
    }
  };

  // Class performance: per subject summary
  const performance = {};
  results.forEach((r) => {
    const key = `${r.subject}`;
    if (!performance[key]) {
      performance[key] = {
        subject: r.subject,
        total: 0,
        obtained: 0,
        count: 0,
        pass: 0,
      };
    }
    performance[key].total += Number(r.totalMarks || 0);
    performance[key].obtained += Number(r.obtainedMarks || 0);
    performance[key].count += 1;
    if (r.status === "Pass") performance[key].pass += 1;
  });
  const performanceRows = Object.values(performance);

  return (
    <div>
      <h1 style={styles.heading}>📝 Results</h1>
      <p style={styles.sub}>Enter marks and view class performance.</p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Marks entry */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Enter Marks</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Student</label>
              <select
                style={styles.input}
                name="student"
                value={form.student}
                onChange={handleChange}
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.className}
                    {s.section ? `-${s.section}` : ""}, Roll {s.rollNo})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Exam</label>
              <input
                style={styles.input}
                name="exam"
                value={form.exam}
                onChange={handleChange}
                placeholder="e.g. Unit Test 1"
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
              <label style={styles.label}>Total Marks</label>
              <input
                style={styles.input}
                name="totalMarks"
                type="number"
                value={form.totalMarks}
                onChange={handleChange}
              />
            </div>
            <div>
              <label style={styles.label}>Obtained Marks</label>
              <input
                style={styles.input}
                name="obtainedMarks"
                type="number"
                value={form.obtainedMarks}
                onChange={handleChange}
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
          </div>

          <button type="submit" style={styles.btn} disabled={submitting}>
            {submitting ? "Entering..." : "Enter Marks"}
          </button>
        </form>
      </div>

      {/* Results list with edit for unlocked */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Results (Your Classes)</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : results.length === 0 ? (
          <p style={styles.empty}>No results for your assigned classes yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Locked</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id}>
                  <td>{r.studentName}</td>
                  <td>
                    {r.className}
                    {r.section ? ` - ${r.section}` : ""}
                  </td>
                  <td>{r.exam}</td>
                  <td>{r.subject}</td>
                  <td>
                    {editingId === r._id ? (
                      <input
                        style={{ width: "60px", padding: "4px" }}
                        type="number"
                        value={editMarks}
                        onChange={(e) => setEditMarks(e.target.value)}
                      />
                    ) : (
                      `${r.obtainedMarks}/${r.totalMarks}`
                    )}
                  </td>
                  <td>{r.percentage}%</td>
                  <td>{r.grade}</td>
                  <td>{r.locked ? "🔒 Yes" : "No"}</td>
                  <td>
                    {editingId === r._id ? (
                      <>
                        <input
                          style={{ width: "60px", padding: "4px", marginRight: "6px" }}
                          type="number"
                          value={editTotal}
                          onChange={(e) => setEditTotal(e.target.value)}
                        />
                        <button
                          style={{ ...styles.btn, padding: "4px 10px", marginRight: "6px" }}
                          onClick={() => saveEdit(r)}
                        >
                          Save
                        </button>
                        <button
                          style={{ ...styles.btnSecondary, padding: "4px 10px" }}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : r.locked ? (
                      "—"
                    ) : (
                      <button
                        style={{ ...styles.btnSecondary, padding: "4px 10px" }}
                        onClick={() => startEdit(r)}
                      >
                        Edit Marks
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Class performance */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Class Performance</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : performanceRows.length === 0 ? (
          <p style={styles.empty}>No performance data yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Entries</th>
                <th>Pass</th>
                <th>Pass Rate</th>
                <th>Average %</th>
              </tr>
            </thead>
            <tbody>
              {performanceRows.map((p) => (
                <tr key={p.subject}>
                  <td>{p.subject}</td>
                  <td>{p.count}</td>
                  <td>{p.pass}</td>
                  <td>{Math.round((p.pass / p.count) * 100)}%</td>
                  <td>
                    {p.total > 0
                      ? Math.round((p.obtained / p.total) * 100)
                      : 0}
                    %
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
