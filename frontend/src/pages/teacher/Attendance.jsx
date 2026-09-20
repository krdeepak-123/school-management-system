import { useState, useEffect } from "react";
import { getMyTeacherClasses } from "../../services/classService";
import { getMyTeacherStudents } from "../../services/studentService";
import {
  getMyTeacherAttendance,
  addAttendance,
  updateAttendance,
} from "../../services/attendanceService";
import styles from "./teacherStyles";

const STATUSES = ["Present", "Absent", "Late"];

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mark-attendance form state
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [marks, setMarks] = useState({});

  const loadRecords = () => {
    getMyTeacherAttendance()
      .then((data) => setRecords(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load attendance records")
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
        loadRecords();
      });
  }, []);

  const studentsForClass = students.filter(
    (s) =>
      `${s.className}${s.section ? `-${s.section}` : ""}` === selectedClass
  );

  const handleMark = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedClass) {
      setError("Please select a class");
      return;
    }

    if (studentsForClass.length === 0) {
      setError("No students found for the selected class");
      return;
    }

    const unmarked = studentsForClass.filter((s) => !marks[s._id]);
    if (unmarked.length > 0) {
      setError("Please mark attendance for every student");
      return;
    }

    const [className, section] = selectedClass.split("-");

    try {
      setMarking(true);

      // One attendance record per student (existing API)
      for (const s of studentsForClass) {
        await addAttendance({
          studentName: s.name,
          className,
          section: section || "",
          rollNo: s.rollNo,
          date,
          status: marks[s._id],
        });
      }

      setSuccess(`Attendance marked for ${studentsForClass.length} students`);
      setMarks({});
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Could not mark attendance");
    } finally {
      setMarking(false);
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    setError("");
    setSuccess("");

    try {
      await updateAttendance(record._id, { status: newStatus });
      setSuccess(`Updated ${record.studentName}'s attendance`);
      loadRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update attendance");
    }
  };

  const present = records.filter((r) => r.status === "Present").length;
  const percent =
    records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  return (
    <div>
      <h1 style={styles.heading}>📅 Attendance</h1>
      <p style={styles.sub}>Mark and manage attendance for your assigned classes.</p>

      {success && <div style={styles.successBanner}>✅ {success}</div>}
      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Mark attendance */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Mark Attendance</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : classes.length === 0 ? (
          <p style={styles.empty}>No classes assigned to you. Contact administration.</p>
        ) : (
          <form onSubmit={handleMark}>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Class</label>
                <select
                  style={styles.input}
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setMarks({});
                  }}
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c._id} value={`${c.className}${c.section ? `-${c.section}` : ""}`}>
                      {c.className}
                      {c.section ? ` - Section ${c.section}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {selectedClass && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsForClass.map((s) => (
                    <tr key={s._id}>
                      <td>{s.rollNo}</td>
                      <td>{s.name}</td>
                      <td>
                        {STATUSES.map((st) => (
                          <label
                            key={st}
                            style={{ marginRight: "14px", cursor: "pointer", fontSize: "13px" }}
                          >
                            <input
                              type="radio"
                              name={`status-${s._id}`}
                              checked={marks[s._id] === st}
                              onChange={() => setMarks({ ...marks, [s._id]: st })}
                            />
                            {" "}{st}
                          </label>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedClass && studentsForClass.length > 0 && (
              <button type="submit" style={{ ...styles.btn, marginTop: "14px" }} disabled={marking}>
                {marking ? "Marking..." : "Submit Attendance"}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Attendance records */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Attendance Records {records.length > 0 ? `(${percent}% present)` : ""}
        </h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : records.length === 0 ? (
          <p style={styles.empty}>No attendance records for your classes yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Section</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.studentName}</td>
                  <td>{r.className}</td>
                  <td>{r.section}</td>
                  <td>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          r.status === "Present"
                            ? "#dcfce7"
                            : r.status === "Absent"
                              ? "#fee2e2"
                              : "#fef9c3",
                        color:
                          r.status === "Present"
                            ? "#166534"
                            : r.status === "Absent"
                              ? "#991b1b"
                              : "#854d0e",
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {STATUSES.filter((st) => st !== r.status).map((st) => (
                      <button
                        key={st}
                        style={{ ...styles.btnSecondary, padding: "4px 10px", marginRight: "6px" }}
                        onClick={() => handleStatusChange(r, st)}
                      >
                        {st}
                      </button>
                    ))}
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
