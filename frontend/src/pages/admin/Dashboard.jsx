import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/auth";

import { getFees } from "../../services/feeService";
import { getExams } from "../../services/examService";
import { getResults } from "../../services/resultService";
import { getNotices } from "../../services/noticeService";
import { getAttendance } from "../../services/attendanceService";

import { statCard, quickAction, boxStyle, welcome, btnInline } from "./dashboardHelper";
import styles from "./directorStyles";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function AdminDashboard() {
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

      const [
        studentsRes,
        teachersRes,
        classesRes,
        attendanceRes,
        feesData,
        examsData,
        resultsData,
        noticesData,
      ] = await Promise.all([
        API.get(`${API_URL}/students`),
        API.get(`${API_URL}/teachers`),
        API.get(`${API_URL}/classes`),
        API.get(`${API_URL}/attendance`),
        getFees(),
        getExams(),
        getResults(),
        getNotices(),
      ]);

      setStudents(studentsRes.data?.data || []);
      setTeachers(teachersRes.data?.data || []);
      setClasses(classesRes.data?.data || []);
      setAttendance(attendanceRes.data?.data || []);
      // getFees/getExams/getResults/getNotices already
      // return the unwrapped data arrays
      setFees(feesData || []);
      setExams(examsData || []);
      setResults(resultsData || []);
      setNotices(noticesData || []);
    } catch (error) {
      console.error("Director Dashboard error:", error);
      setStudents([]);
      setTeachers([]);
      setClasses([]);
      setAttendance([]);
      setFees([]);
      setExams([]);
      setResults([]);
      setNotices([]);
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
    attendance.length > 0 ? Math.round((presentAttendance / attendance.length) * 100) : 0;

  const totalFee = fees.reduce((s, f) => s + Number(f.totalFee || 0), 0);
  const paidFee = fees.reduce((s, f) => s + Number(f.paidAmount || 0), 0);
  const dueFee = fees.reduce((s, f) => s + Number(f.dueAmount || 0), 0);

  const totalExams = exams.length;
  const upcomingExams = exams.filter((e) => new Date(e.examDate) >= new Date());

  const totalResults = results.length;
  const passedResults = results.filter((r) => r.status === "Pass").length;
  const avgPercentage =
    totalResults > 0
      ? Math.round(results.reduce((s, r) => s + Number(r.percentage || 0), 0) / totalResults)
      : 0;

  // =====================================
  // STAT CARDS
  // =====================================

  const stats = [
    { title: "Students", value: loading ? "..." : totalStudents, icon: "👨‍🎓", color: "#2563eb", path: "/students" },
    { title: "Teachers", value: loading ? "..." : totalTeachers, icon: "👨‍🏫", color: "#0f9d58", path: "/teachers" },
    { title: "Classes", value: loading ? "..." : totalClasses, icon: "📚", color: "#ea580c", path: "/classes" },
    { title: "Attendance", value: loading ? "..." : `${attendancePercentage}%`, icon: "📅", color: "#9333ea", path: "/attendance" },
    { title: "Fee Collected", value: loading ? "..." : `₹${paidFee.toLocaleString()}`, icon: "💰", color: "#dc2626", path: "/fees" },
    { title: "Fee Due", value: loading ? "..." : `₹${dueFee.toLocaleString()}`, icon: "⏳", color: "#ea580c", path: "/fees" },
    { title: "Upcoming Exams", value: loading ? "..." : upcomingExams.length, icon: "📝", color: "#0891b2", path: "/exams" },
    { title: "Results", value: loading ? "..." : `${totalResults} (${passedResults} passed)`, icon: "🏆", color: "#16a34a", path: "/results" },
  ];

  return (
    <div>
      <h1 style={styles.heading}>🏛️ Admin Dashboard</h1>
      <p style={styles.sub}>School-wide overview — live data from the same APIs every portal uses</p>

      {/* WELCOME BANNER */}
      <div style={welcome}>
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {user?.name || "Director"} 👋</h2>
          <p style={{ margin: "4px 0 0", opacity: 0.85 }}>School overview at a glance</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/results" style={btnInline}>📝 Publish Result</Link>
          <Link to="/attendance" style={btnInline}>📅 Take Attendance</Link>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={statCard.grid}>
        {stats.map((item, index) => (
          <Link key={index} to={item.path} style={statCard.card}>
            <div style={{ ...statCard.icon, background: item.color }}>{item.icon}</div>
            <h2 style={statCard.number}>{item.value}</h2>
            <p style={statCard.title}>{item.title}</p>
          </Link>
        ))}
      </div>

      {/* BOTTOM SECTION */}
      <div style={styles.bottomGrid}>
        <div style={boxStyle}>
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
            <li>Average : {loading ? "..." : `${avgPercentage}%`}</li>
          </ul>
        </div>

        <div style={boxStyle}>
          <h2>⚡ Quick Actions</h2>
          {[
            ["➕ Add Student", "/students", "👨‍🎓"],
            ["👨‍🏫 Add Teacher", "/teachers", "👨‍🏫"],
            ["📚 Add Class", "/classes", "📚"],
            ["📅 Take Attendance", "/attendance", "📅"],
            ["💰 Manage Fees", "/fees", "💰"],
            ["📝 Publish Result", "/results", "📝"],
          ].map(([label, path, icon], index) => (
            <Link key={index} to={path} style={quickAction}>
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT NOTICES */}
      <div style={boxStyle}>
        <h2>📢 Recent Notices</h2>
        {loading ? (
          <p style={{ color: "#64748b" }}>Loading notices...</p>
        ) : notices.length === 0 ? (
          <p style={{ color: "#64748b" }}>No notices published yet.</p>
        ) : (
          <ul style={styles.list}>
            {notices.slice(0, 5).map((n) => (
              <li key={n._id}>
                <strong>{n.title}</strong> · {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "-"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
