import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

import { getFees } from "../services/feeService";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================
  // LOAD DASHBOARD DATA
  // =====================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        studentsRes,
        teachersRes,
        classesRes,
        attendanceRes,
        feesData,
        resultsRes,
      ] = await Promise.all([
        API.get(
          `${API_URL}/students`
        ),

        API.get(
          `${API_URL}/teachers`
        ),

        API.get(
          `${API_URL}/classes`
        ),

        API.get(
          `${API_URL}/attendance`
        ),

        getFees(),

        API.get(
          `${API_URL}/results`
        ),
      ]);

      // ==============================
      // STUDENTS
      // ==============================

      setStudents(
        studentsRes.data?.data || []
      );

      // ==============================
      // TEACHERS
      // ==============================

      setTeachers(
        teachersRes.data?.data || []
      );

      // ==============================
      // CLASSES
      // ==============================

      setClasses(
        classesRes.data?.data || []
      );

      // ==============================
      // ATTENDANCE
      // ==============================

      setAttendance(
        attendanceRes.data?.data || []
      );

      // ==============================
      // FEES
      // ==============================

      setFees(
        feesData || []
      );

      // ==============================
      // RESULTS
      // ==============================

      setResults(
        resultsRes.data?.data || []
      );

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      setStudents([]);
      setTeachers([]);
      setClasses([]);
      setAttendance([]);
      setFees([]);
      setResults([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // STUDENT COUNTS
  // =====================================

  const totalStudents =
    students.length;

  const activeStudents =
    students.filter(
      (student) =>
        student.status?.toLowerCase() ===
        "active"
    ).length;

  const inactiveStudents =
    students.filter(
      (student) =>
        student.status?.toLowerCase() ===
        "inactive"
    ).length;

  // =====================================
  // TEACHER COUNT
  // =====================================

  const totalTeachers =
    teachers.length;

  // =====================================
  // CLASS COUNT
  // =====================================

  const totalClasses =
    classes.length;

  // =====================================
  // ATTENDANCE
  // =====================================

  const totalAttendance =
    attendance.length;

  const presentAttendance =
    attendance.filter(
      (item) =>
        item.status === "Present"
    ).length;

  const absentAttendance =
    attendance.filter(
      (item) =>
        item.status === "Absent"
    ).length;

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round(
          (presentAttendance /
            totalAttendance) *
            100
        )
      : 0;

  // =====================================
  // FEES
  // =====================================

  const totalFees =
    fees.reduce(
      (sum, fee) =>
        sum +
        Number(
          fee.totalFee || 0
        ),
      0
    );

  const totalPaidFees =
    fees.reduce(
      (sum, fee) =>
        sum +
        Number(
          fee.paidAmount || 0
        ),
      0
    );

  const totalDueFees =
    fees.reduce(
      (sum, fee) =>
        sum +
        Number(
          fee.dueAmount || 0
        ),
      0
    );

  // =====================================
  // RESULTS
  // =====================================

  const totalResults =
    results.length;

  const passedResults =
    results.filter(
      (item) =>
        item.status === "Pass"
    ).length;

  const failedResults =
    results.filter(
      (item) =>
        item.status === "Fail"
    ).length;

  // =====================================
  // RESULT AVERAGE PERCENTAGE
  // =====================================

  const averageResultPercentage =
    totalResults > 0
      ? Math.round(
          results.reduce(
            (sum, item) =>
              sum +
              Number(
                item.percentage || 0
              ),
            0
          ) / totalResults
        )
      : 0;

  // =====================================
  // DASHBOARD CARDS
  // =====================================

  const stats = [
    {
      title: "Students",
      value: loading
        ? "..."
        : totalStudents,
      icon: "👨‍🎓",
      color: "#2563eb",
      path: "/students",
    },

    {
      title: "Active Students",
      value: loading
        ? "..."
        : activeStudents,
      icon: "🟢",
      color: "#16a34a",
    },

    {
      title: "Inactive Students",
      value: loading
        ? "..."
        : inactiveStudents,
      icon: "🔴",
      color: "#dc2626",
    },

    {
      title: "Teachers",
      value: loading
        ? "..."
        : totalTeachers,
      icon: "👨‍🏫",
      color: "#0f9d58",
      path: "/teachers",
    },

    {
      title: "Classes",
      value: loading
        ? "..."
        : totalClasses,
      icon: "📚",
      color: "#ea580c",
      path: "/classes",
    },

    {
      title: "Attendance",
      value: loading
        ? "..."
        : `${attendancePercentage}%`,
      icon: "📅",
      color: "#9333ea",
      path: "/attendance",
    },

    {
      title: "Fees",
      value: loading
        ? "..."
        : `₹${totalFees.toLocaleString()}`,
      icon: "💰",
      color: "#dc2626",
      path: "/fees",
    },

    {
      title: "Results",
      value: loading
        ? "..."
        : totalResults,
      icon: "📝",
      color: "#0891b2",
      path: "/results",
    },
  ];

  // =====================================
  // RETURN UI
  // =====================================

  return (
    <div>

      {/* ================================= */}
      {/* HEADING */}
      {/* ================================= */}

      <h1 style={styles.heading}>
        📊 Dashboard
      </h1>

      {/* ================================= */}
      {/* DASHBOARD CARDS */}
      {/* ================================= */}

      <div style={styles.grid}>

        {stats.map(
          (item, index) =>
            item.path ? (
              <Link
                key={index}
                to={item.path}
                style={{
                  textDecoration: "none",
                }}
              >

                <div
                  style={styles.card}
                >

                  <div
                    style={{
                      ...styles.icon,
                      background:
                        item.color,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h2
                    style={
                      styles.number
                    }
                  >
                    {item.value}
                  </h2>

                  <p
                    style={
                      styles.title
                    }
                  >
                    {item.title}
                  </p>

                </div>

              </Link>
            ) : (
              <div
                key={index}
                style={styles.card}
              >

                <div
                  style={{
                    ...styles.icon,
                    background:
                      item.color,
                  }}
                >
                  {item.icon}
                </div>

                <h2
                  style={
                    styles.number
                  }
                >
                  {item.value}
                </h2>

                <p
                  style={
                    styles.title
                  }
                >
                  {item.title}
                </p>

              </div>
            )
        )}

      </div>

      {/* ================================= */}
      {/* RESULT SUMMARY */}
      {/* ================================= */}

      <div
        style={
          styles.resultSummary
        }
      >

        <div
          style={
            styles.resultSummaryHeader
          }
        >

          <div>
            <h2
              style={
                styles.resultHeading
              }
            >
              📝 Result Overview
            </h2>

            <p
              style={
                styles.resultSubtitle
              }
            >
              Examination performance
              summary
            </p>
          </div>

          <Link
            to="/results"
            style={
              styles.viewResultBtn
            }
          >
            View Results →
          </Link>

        </div>

        <div
          style={
            styles.resultCards
          }
        >

          {/* TOTAL RESULTS */}

          <div
            style={{
              ...styles.resultCard,
              borderLeft:
                "5px solid #0891b2",
            }}
          >

            <span
              style={
                styles.resultLabel
              }
            >
              Total Results
            </span>

            <strong
              style={
                styles.resultNumber
              }
            >
              {loading
                ? "..."
                : totalResults}
            </strong>

          </div>

          {/* PASSED */}

          <div
            style={{
              ...styles.resultCard,
              borderLeft:
                "5px solid #16a34a",
            }}
          >

            <span
              style={
                styles.resultLabel
              }
            >
              Passed
            </span>

            <strong
              style={
                styles.resultNumber
              }
            >
              {loading
                ? "..."
                : passedResults}
            </strong>

          </div>

          {/* FAILED */}

          <div
            style={{
              ...styles.resultCard,
              borderLeft:
                "5px solid #dc2626",
            }}
          >

            <span
              style={
                styles.resultLabel
              }
            >
              Failed
            </span>

            <strong
              style={
                styles.resultNumber
              }
            >
              {loading
                ? "..."
                : failedResults}
            </strong>

          </div>

          {/* AVERAGE */}

          <div
            style={{
              ...styles.resultCard,
              borderLeft:
                "5px solid #9333ea",
            }}
          >

            <span
              style={
                styles.resultLabel
              }
            >
              Average %
            </span>

            <strong
              style={
                styles.resultNumber
              }
            >
              {loading
                ? "..."
                : `${averageResultPercentage}%`}
            </strong>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* BOTTOM SECTION */}
      {/* ================================= */}

      <div
        style={
          styles.bottomGrid
        }
      >

        {/* =============================== */}
        {/* RECENT ACTIVITIES */}
        {/* =============================== */}

        <div
          style={styles.box}
        >

          <h2>
            📢 Recent Activities
          </h2>

          <ul
            style={styles.list}
          >

            <li>
              Total Students :{" "}
              {totalStudents}
            </li>

            <li>
              Active Students :{" "}
              {activeStudents}
            </li>

            <li>
              Inactive Students :{" "}
              {inactiveStudents}
            </li>

            <li>
              Total Teachers :{" "}
              {totalTeachers}
            </li>

            <li>
              Total Classes :{" "}
              {totalClasses}
            </li>

            <li>
              Attendance :{" "}
              {attendancePercentage}%
            </li>

            <li>
              Total Fee : ₹
              {totalFees.toLocaleString()}
            </li>

            <li>
              Paid Fee : ₹
              {totalPaidFees.toLocaleString()}
            </li>

            <li>
              Due Fee : ₹
              {totalDueFees.toLocaleString()}
            </li>

            <li>
              Total Results :{" "}
              {totalResults}
            </li>

            <li>
              Passed Results :{" "}
              {passedResults}
            </li>

            <li>
              Failed Results :{" "}
              {failedResults}
            </li>

            <li>
              Average Result :{" "}
              {averageResultPercentage}%
            </li>

            <li>
              School Management System
              Running...
            </li>

          </ul>

        </div>

        {/* =============================== */}
        {/* QUICK ACTIONS */}
        {/* =============================== */}

        <div
          style={styles.box}
        >

          <h2>
            ⚡ Quick Actions
          </h2>

          <Link
            style={styles.btn}
            to="/students"
          >
            ➕ Add Student
          </Link>

          <Link
            style={styles.btn}
            to="/teachers"
          >
            👨‍🏫 Add Teacher
          </Link>

          <Link
            style={styles.btn}
            to="/classes"
          >
            📚 Add Class
          </Link>

          <Link
            style={styles.btn}
            to="/attendance"
          >
            📅 Take Attendance
          </Link>

          <Link
            style={styles.btn}
            to="/fees"
          >
            💰 Add Fee
          </Link>

          <Link
            style={styles.btn}
            to="/results"
          >
            📝 Publish Result
          </Link>

        </div>

      </div>

    </div>
  );
}

// =====================================
// STYLES
// =====================================

const styles = {

  heading: {
    marginBottom: "20px",
    color: "#1e293b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center",
    boxShadow:
      "0 3px 10px rgba(0,0,0,.1)",
    cursor: "pointer",
    transition: "0.3s",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "28px",
    margin: "auto",
  },

  number: {
    marginTop: "15px",
    color: "#1e293b",
  },

  title: {
    color: "#64748b",
  },

  // =====================================
  // RESULT SUMMARY
  // =====================================

  resultSummary: {
    background: "#fff",
    padding: "22px",
    borderRadius: "12px",
    marginTop: "30px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,.1)",
  },

  resultSummaryHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  resultHeading: {
    margin: 0,
    color: "#1e293b",
  },

  resultSubtitle: {
    margin:
      "5px 0 0 0",
    color: "#64748b",
  },

  viewResultBtn: {
    background: "#0891b2",
    color: "#fff",
    padding:
      "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  resultCards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "15px",
  },

  resultCard: {
    background: "#f8fafc",
    padding: "18px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  resultLabel: {
    color: "#64748b",
    fontSize: "14px",
  },

  resultNumber: {
    color: "#1e293b",
    fontSize: "25px",
  },

  // =====================================
  // BOTTOM SECTION
  // =====================================

  bottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow:
      "0 3px 10px rgba(0,0,0,.1)",
  },

  list: {
    lineHeight: "35px",
  },

  btn: {
    display: "block",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "12px",
    textAlign: "center",
    fontWeight: "bold",
  },

};