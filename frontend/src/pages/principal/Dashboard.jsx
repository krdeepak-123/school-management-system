import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/auth";

import { getFees } from "../../services/feeService";
import { getExams } from "../../services/examService";
import { getResults } from "../../services/resultService";
import { getNotices } from "../../services/noticeService";
import { getTimetables } from "../../services/timetableService";
import { getAttendance } from "../../services/attendanceService";

import styles from "./principalStyles";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// =====================================
// REAL-DATA PRINCIPAL DASHBOARD
// Aggregates live school-wide statistics
// using the SAME services/APIs every
// other role portal reuses (reuse).
// =====================================

export default function PrincipalDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetables, setTimetables] = useState([]);

  // =====================================
  // LOAD ALL SCHOOL DATA
  // =====================================

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        API.get(`${API_URL}/students`),
        API.get(`${API_URL}/teachers`),
        API.get(`${API_URL}/classes`),
      ]);

      const [attendanceRes, feeData, examsRes, resultsRes, noticesRes, timetablesRes] = await Promise.all([
        API.get(`${API_URL}/attendance`),
        getFees(),
        getExams(),
        getResults(),
        getNotices(),
        getTimetables(),
      ]);

      setStudents(studentsRes.data?.data || []);
      setTeachers(teachersRes.data?.data || []);
      setClasses(classesRes.data?.data || []);
      setAttendance(attendanceRes.data?.data || []);
      setFees(feeData || []);
      setExams(examsRes.data?.data || []);
      setResults(resultsRes.data?.data || []);
      setNotices(noticesRes.data?.data || []);
      setTimetables(timetablesRes.data?.data || []);
    } catch (error) {
      console.error("Principal Dashboard Error:", error);
      setStudents([]);
      setTeachers([]);
      setClasses([]);
      setAttendance([]);
      setFees([]);
      setExams([]);
      setResults([]);
      setNotices([]);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // COMPUTE STATS
  // =====================================

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const presentAttendance = attendance.filter((a) => a.status === "Present").length;
  const attendancePercentage =
    attendance.length > 0
      ? Math.round((presentAttendance / attendance.length) * 100)
      : 0;

  const totalFee = fees.reduce((s, f) => s + Number(f.totalFee || 0), 0);
  const paidFee = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
  const dueFee = fees.reduce((s, f) => s + Number(f.dueAmount || 0), 0);

  const totalExams = exams.length;
  const upcomingExams = exams.filter((e) => new Date(e.date) >= new Date());

  const totalResults = results.length;
  const passedResults = results.filter((r) => r.status === "Pass").length;
  const averageResultPercentage =
    totalResults > 0
      ? Math.round(results.reduce((s, r) => s + Number(r.percentage || 0), 0) / totalResults)
      : 0;

  // =====================================
  // RECENT NOTICES (newest first)
  // =====================================

  const recentNotices = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // =====================================
  // QUICK ACTIONS
  // =====================================

  const quickActions = [
    { title: "➕ Add Student", path: "/students", icon: "👨‍🎓" },
    { title: "👨‍🏫 Add Teacher", path: "/teachers", icon: "👨‍🏫" },
    { title: "📚 Add Class", path: "/classes", icon: "📚" },
    { title: "📅 Take Attendance", path: "/attendance", icon: "📅" },
    { title: "💰 Manage Fees", path: "/fees", icon: "💰" },
    { title: "📝 Publish Result", path: "/results", icon: "📝" },
  ];

  return (
    <div>
      {/* ================================= */}
      {/* HEADING */}
      {/* ================================= */}

      <h1 style={styles.heading}>🏫 Principal Dashboard</h1>

      {/* ================================= */}
      {/* WELCOME BANNER */}
      {/* ================================= */}

      <div
        style={{
          ...styles.welcomeBanner,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          padding: "22px",
          borderRadius: "12px",
          background: "#1e293b",
          color: "#fff",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#fff" }}>
            Welcome, {user?.name || "Principal"} 👋
          </h2>
          <p style={{ margin: "4px 0 0", color: "#94a3b8" }}>
            School-wide overview at a glance
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            to="/results"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📝 Publish Result
          </Link>

          <Link
            to="/attendance"
            style={{
              background: "#0f9d58",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📅 Take Attendance
          </Link>
        </div>
      </div>

      {/* ================================= */}
      {/* STAT CARDS */}
      {/* ================================= */}

      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "18px" }}>
          Loading dashboard data...
        </p>
      ) : (
        <div style={styles.grid}>
          {[
            {
              title: "Total Students",
              value: totalStudents,
              icon: "👨‍🎓",
              color: "#2563eb",
              path: "/students",
            },
            {
              title: "Total Teachers",
              value: totalTeachers,
              icon: "👨‍🏫",
              color: "#0f9d58",
              path: "/teachers",
            },
            {
              title: "Total Classes",
              value: totalClasses,
              icon: "📚",
              color: "#ea580c",
              path: "/classes",
            },
            {
              title: "Attendance",
              value: `${attendancePercentage}%`,
              icon: "📅",
              color: "#9333ea",
              path: "/attendance",
            },
            {
              title: "Fee Collected",
              value: `₹${paidFee.toLocaleString()}`,
              icon: "💰",
              color: "#dc2626",
              path: "/fees",
            },
            {
              title: "Total Results",
              value: totalResults,
              icon: "🏆",
              color: "#0891b2",
              path: "/results",
            },
          ].map((item, index) => (
            <Link key={index} to={item.path} style={styles.card}>
              <div style={{ ...styles.icon, background: item.color }}>{item.icon}</div>
              <h2 style={styles.number}>{item.value}</h2>
              <p style={styles.title}>{item.title}</p>
            </Link>
          ))}
        </div>
      )}

      {/* ================================= */}
      {/* SUMMARY + QUICK ACTIONS */}
      {/* ================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* SCHOOL SUMMARY */}
        <div style={styles.box}>
          <h2>📢 School Summary</h2>
          <ul style={styles.list}>
            <li>Total Students : {loading ? "..." : totalStudents}</li>
            <li>Total Teachers : {loading ? "..." : totalTeachers}</li>
            <li>Total Classes : {loading ? "..." : totalClasses}</li>
            <li>Attendance : {loading ? "..." : `${attendancePercentage}%`}</li>
            <li>Total Fee : ₹{loading ? "..." : totalFee.toLocaleString()}</li>
            <li>Paid Fee : ₹{loading ? "..." : paidFee.toLocaleString()}</li>
            <li>Due Fee : ₹{loading ? "..." : dueFee.toLocaleString()}</li>
            <li>Total Exams : {loading ? "..." : totalExams}</li>
            <li>Upcoming Exams : {loading ? "..." : upcomingExams.length}</li>
            <li>Total Results : {loading ? "..." : totalResults}</li>
            <li>Passed : {loading ? "..." : passedResults}</li>
            <li>Average % : {loading ? "..." : `${averageResultPercentage}%`}</li>
          </ul>
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.box}>
          <h2>⚡ Quick Actions</h2>
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} style={styles.btn}>
              {action.icon} {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* ================================= */}
      {/* RECENT NOTICES */}
      {/* ================================= */}

      <div style={styles.box}>
        <h2>📢 Recent Notices</h2>

        {loading ? (
          <p>Loading notices...</p>
        ) : recentNotices.length === 0 ? (
          <p style={{ color: "#64748b" }}>No notices published yet.</p>
        ) : (
          <ul style={styles.list}>
            {recentNotices.map((notice) => (
              <li key={notice._id}>
                <strong>{notice.title}</strong>
                {notice.date && (
                  <span style={{ color: "#64748b" }}>
                    {" "}
                    · {new Date(notice.date).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
