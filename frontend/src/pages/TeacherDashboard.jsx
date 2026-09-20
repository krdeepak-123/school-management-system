import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { getMyTeacherClasses } from "../services/classService";
import { getMyTeacherSubjects } from "../services/subjectService";
import { getMyTeacherStudents } from "../services/studentService";
import { getMyTeacherAttendance } from "../services/attendanceService";
import { getMyAssignments } from "../services/assignmentService";
import { getExams } from "../services/examService";
import { getTimetables } from "../services/timetableService";
import { getNotices } from "../services/noticeService";
import { getLeaves } from "../services/leaveService";
import styles from "./teacher/teacherStyles";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TeacherDashboard() {
  const { user, refreshProfile } = useAuth();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const teacher = user?.linkedData;

  useEffect(() => {
    refreshProfile();

    Promise.all([
      getMyTeacherClasses(),
      getMyTeacherSubjects(),
      getMyTeacherStudents(),
      getMyTeacherAttendance(),
      getMyAssignments(),
      getExams(),
      getTimetables(),
      getNotices(),
      getLeaves(),
    ])
      .then(
        ([
          classData,
          subjectData,
          studentData,
          attendanceData,
          assignmentData,
          examData,
          timetableData,
          noticeData,
          leaveData,
        ]) => {
          setClasses(classData || []);
          setSubjects(subjectData || []);
          setStudents(studentData || []);
          setAttendance(attendanceData || []);
          setAssignments(assignmentData || []);
          setExams(examData || []);
          setTimetable(timetableData || []);
          setNotices(noticeData || []);
          setLeaves(leaveData || []);
        }
      )
      .catch((error) => console.error("Teacher Dashboard Error:", error))
      .finally(() => setLoading(false));
  }, [refreshProfile]);

  const teacherName = teacher?.name || user?.name || "";

  // Today's classes: timetable entries for today where the teacher appears
  const todayName = DAY_NAMES[new Date().getDay()];
  const todayEntries = timetable.filter(
    (t) =>
      t.day === todayName &&
      t.periods?.some(
        (p) => p.teacher && p.teacher.toLowerCase() === teacherName.toLowerCase()
      )
  );

  // Attendance summary for assigned classes
  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const attendancePercent =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  // Upcoming exams for assigned classes
  const myClassKeys = classes.map((c) => ({
    className: c.className,
    section: c.section || "",
  }));
  const isMyClass = (e) =>
    myClassKeys.some(
      (c) =>
        c.className.toLowerCase() === (e.className || "").toLowerCase() &&
        (!c.section || !(e.section || "") || c.section.toLowerCase() === (e.section || "").toLowerCase())
    );

  const today = new Date();
  const upcomingExams = exams
    .filter(
      (e) =>
        isMyClass(e) &&
        (new Date(e.examDate) >= today || e.status === "Upcoming")
    )
    .slice(0, 5);

  // Pending work: open assignments + pending leave requests
  const openAssignments = assignments.filter(
    (a) => new Date(a.dueDate) >= today
  );
  const pendingLeaves = leaves.filter((l) => l.status === "Pending");
  const pendingWorkCount = openAssignments.length + pendingLeaves.length;

  const recentNotices = notices.slice(0, 3);

  return (
    <div>
      <h1 style={styles.heading}>👨‍🏫 Teacher Dashboard</h1>

      {/* Profile Card */}
      <div style={{ ...styles.section, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: 0 }}>
        <div>
          <h2 style={styles.sectionTitle}>{teacherName}</h2>
          <p style={styles.empty}>
            Teacher ID: <strong>{teacher?.teacherId || user?.userId}</strong>
            {teacher?.department ? ` | ${teacher.department}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "20px", color: "#334155", flexWrap: "wrap" }}>
          <span>Subject: <strong>{teacher?.subject || "-"}</strong></span>
          <span>Classes: <strong>{loading ? "..." : classes.length}</strong></span>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#2563eb" }}>📚</div>
          <h3 style={styles.number}>{loading ? "..." : classes.length}</h3>
          <p style={styles.label}>Assigned Classes</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#7c3aed" }}>📖</div>
          <h3 style={styles.number}>{loading ? "..." : subjects.length}</h3>
          <p style={styles.label}>Assigned Subjects</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#0891b2" }}>👨‍🎓</div>
          <h3 style={styles.number}>{loading ? "..." : students.length}</h3>
          <p style={styles.label}>Total Students</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#16a34a" }}>🕐</div>
          <h3 style={styles.number}>{loading ? "..." : todayEntries.length}</h3>
          <p style={styles.label}>Today's Classes ({todayName})</p>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.icon, background: "#dc2626" }}>⚠️</div>
          <h3 style={styles.number}>{loading ? "..." : pendingWorkCount}</h3>
          <p style={styles.label}>Pending Work</p>
        </div>
      </div>

      {/* Attendance Summary */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📅 Attendance Summary</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : attendance.length === 0 ? (
          <p style={styles.empty}>No attendance records for your classes yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <span>Total Records: <strong>{attendance.length}</strong></span>
            <span>Present: <strong style={{ color: "#166534" }}>{presentCount}</strong></span>
            <span>Absent: <strong style={{ color: "#991b1b" }}>{attendance.filter((a) => a.status === "Absent").length}</strong></span>
            <span>Late: <strong style={{ color: "#854d0e" }}>{attendance.filter((a) => a.status === "Late").length}</strong></span>
            <span>Present %: <strong>{attendancePercent}%</strong></span>
          </div>
        )}
      </div>

      {/* Upcoming Exams */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🧪 Upcoming Exams</h2>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : upcomingExams.length === 0 ? (
          <p style={styles.empty}>No upcoming exams for your classes.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.subject || "-"}</td>
                  <td>
                    {e.className}
                    {e.section ? ` - ${e.section}` : ""}
                  </td>
                  <td>{new Date(e.examDate).toLocaleDateString()}</td>
                  <td>{e.startTime || "-"}</td>
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
    </div>
  );
}
