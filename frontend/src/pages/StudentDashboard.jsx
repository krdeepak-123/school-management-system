import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { getMyFees } from "../services/feeService";
import { getMyResults } from "../services/resultService";
import { getMyAttendance } from "../services/attendanceService";
import { getMyExams } from "../services/examService";
import { getMyNotices } from "../services/noticeService";
import { getMyAssignments } from "../services/assignmentService";
import styles from "./student/studentStyles";

export default function StudentDashboard() {
  const { user, refreshProfile } = useAuth();

  const [fees, setFees] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const student = user?.linkedData;

  useEffect(() => {
    refreshProfile();

    Promise.all([
      getMyFees(),
      getMyResults(),
      getMyAttendance(),
      getMyExams(),
      getMyNotices(),
      getMyAssignments(),
    ])
      .then(([feeData, resultData, attendanceData, examData, noticeData, assignmentData]) => {
        setFees(feeData || []);
        setResults(resultData || []);
        setAttendance(attendanceData || []);
        setExams(examData || []);
        setNotices(noticeData || []);
        setAssignments(assignmentData || []);
      })
      .catch((error) => console.error("Student Dashboard Error:", error))
      .finally(() => setLoading(false));
  }, [refreshProfile]);

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const attendancePercent =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const pendingFees = fees.filter((f) => Number(f.dueAmount) > 0);
  const totalDue = pendingFees.reduce((s, f) => s + Number(f.dueAmount || 0), 0);

  const today = new Date();
  const upcomingExams = exams
    .filter((e) => new Date(e.examDate) >= today || e.status === "Upcoming")
    .slice(0, 5);

  const recentResults = results.slice(0, 5);
  const recentNotices = notices.slice(0, 3);
  const openAssignments = assignments.filter((a) => new Date(a.dueDate) >= today).slice(0, 5);

  return (
    <div>
      <h1 style={styles.heading}>🎓 Student Dashboard</h1>

      {/* Profile Card */}
      <div style={{ ...styles.section, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: 0 }}>
        <div>
          <h2 style={styles.sectionTitle}>{student?.name || user?.name}</h2>
          <p style={styles.empty}>
            Student ID: <strong>{student?.admissionNo || user?.userId}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "20px", color: "#334155", flexWrap: "wrap" }}>
          <span>Class: <strong>{student?.className || "-"}</strong></span>
          <span>Section: <strong>{student?.section || "-"}</strong></span>
          <span>Roll No: <strong>{student?.rollNo || "-"}</strong></span>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#16a34a" }}>📅</div>
          <h3 style={styles.number}>{loading ? "..." : `${attendancePercent}%`}</h3>
          <p style={styles.label}>Attendance</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#dc2626" }}>💰</div>
          <h3 style={styles.number}>{loading ? "..." : `₹${totalDue.toLocaleString()}`}</h3>
          <p style={styles.label}>Pending Fees</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#0891b2" }}>🧪</div>
          <h3 style={styles.number}>{loading ? "..." : upcomingExams.length}</h3>
          <p style={styles.label}>Upcoming Exams</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#7c3aed" }}>📚</div>
          <h3 style={styles.number}>{loading ? "..." : openAssignments.length}</h3>
          <p style={styles.label}>Open Assignments</p>
        </div>
      </div>

      {/* Recent Results */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📝 Recent Results</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : recentResults.length === 0 ? (
          <p style={styles.empty}>No results published yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r) => (
                <tr key={r._id}>
                  <td>{r.exam}</td>
                  <td>{r.subject}</td>
                  <td>{r.obtainedMarks}/{r.totalMarks}</td>
                  <td>{r.percentage}%</td>
                  <td>{r.grade}</td>
                  <td>{r.status === "Pass" ? "🟢 Pass" : "🔴 Fail"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upcoming Exams */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🧪 Upcoming Exams</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : upcomingExams.length === 0 ? (
          <p style={styles.empty}>No upcoming exams scheduled.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.subject || "-"}</td>
                  <td>{new Date(e.examDate).toLocaleDateString()}</td>
                  <td>{e.startTime || "-"}</td>
                  <td>{e.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pending Fees */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>💰 Pending Fees</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : pendingFees.length === 0 ? (
          <p style={styles.empty}>No pending fees. All clear! 🎉</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Fee ID</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingFees.map((f) => (
                <tr key={f._id}>
                  <td>{f.feeId}</td>
                  <td>₹{f.totalFee?.toLocaleString()}</td>
                  <td>₹{f.paidAmount?.toLocaleString()}</td>
                  <td>₹{f.dueAmount?.toLocaleString()}</td>
                  <td>{new Date(f.paymentDate).toLocaleDateString()}</td>
                  <td>{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Notices */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📢 Recent Notices</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : recentNotices.length === 0 ? (
          <p style={styles.empty}>No notices published yet.</p>
        ) : (
          recentNotices.map((n) => (
            <div key={n._id} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <strong style={{ color: "#1e293b" }}>📢 {n.title}</strong>
              <p style={{ margin: "6px 0 0 0", color: "#334155", fontSize: "14px" }}>
                {n.message}
              </p>
              <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "12px" }}>
                {new Date(n.createdAt).toLocaleDateString()} | {n.postedBy}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Assignments */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📚 Assignments</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : assignments.length === 0 ? (
          <p style={styles.empty}>No assignments for your class yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Due Date</th>
                <th>Assigned By</th>
              </tr>
            </thead>
            <tbody>
              {assignments.slice(0, 5).map((a) => {
                const overdue = new Date(a.dueDate) < today;
                return (
                  <tr key={a._id}>
                    <td>{a.title}</td>
                    <td>{a.subject}</td>
                    <td style={{ color: overdue ? "#991b1b" : "#334155" }}>
                      {new Date(a.dueDate).toLocaleDateString()}
                      {overdue ? " (overdue)" : ""}
                    </td>
                    <td>{a.assignedBy || "-"}</td>
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
