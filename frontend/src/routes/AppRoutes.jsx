import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/forgetPassword";
import Unauthorized from "../pages/Unauthorized";

import MainLayout from "../layouts/mainLayout";
import HomeRedirect from "../pages/HomeRedirect";
import Dashboard from "../pages/Dashboard";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from "../pages/TeacherDashboard";
import Students from "../pages/Students";

import ProtectedRoute, { RoleRoute } from "../components/ProtectedRoute";

// Teacher Portal pages
import TeacherAssignments from "../pages/teacher/Assignments";
import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherChangePassword from "../pages/teacher/ChangePassword";

// Principal Portal pages
import PrincipalDashboard from "../pages/principal/Dashboard";
import PrincipalProfile from "../pages/principal/Profile";
import PrincipalChangePassword from "../pages/principal/ChangePassword";

// Director Portal pages
import DirectorDashboard from "../pages/director/Dashboard";
import DirectorProfile from "../pages/director/Profile";
import DirectorChangePassword from "../pages/director/ChangePassword";

// Admin Portal pages (real-data, role-scoped to admin)
import AdminDashboard from "../pages/admin/Dashboard";
import AdminProfile from "../pages/admin/Profile";
import AdminChangePassword from "../pages/admin/ChangePassword";

import TeacherClasses from "../pages/teacher/Classes";
import TeacherSubjects from "../pages/teacher/Subjects";
import TeacherStudents from "../pages/teacher/Students";
import TeacherTimetable from "../pages/teacher/Timetable";
import TeacherExams from "../pages/teacher/Exams";
import TeacherResults from "../pages/teacher/Results";
import TeacherLeaves from "../pages/teacher/Leaves";
import TeacherMaterials from "../pages/teacher/Materials";
import TeacherNotices from "../pages/teacher/Notices";
import TeacherProfile from "../pages/teacher/Profile";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import Attendance from "../pages/Attendance";
import Fees from "../pages/Fees";
import Results from "../pages/Results";

// Student Portal pages
import StudentProfile from "../pages/student/Profile";
import StudentAttendance from "../pages/student/Attendance";
import StudentClasses from "../pages/student/Classes";
import StudentSubjects from "../pages/student/Subjects";
import StudentTimetable from "../pages/student/Timetable";
import StudentResults from "../pages/student/Results";
import StudentExams from "../pages/student/Exams";
import StudentFees from "../pages/student/Fees";
import StudentReceipts from "../pages/student/Receipts";
import StudentAssignments from "../pages/student/Assignments";
import StudentMaterials from "../pages/student/Materials";
import StudentNotices from "../pages/student/Notices";
import StudentLeave from "../pages/student/Leave";
import StudentChangePassword from "../pages/student/ChangePassword";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Role-aware landing */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin / Principal / Director full dashboard (named by role) */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleRoute roles={["admin"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* Dedicated Admin Portal (role-scoped, real data) */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute roles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <RoleRoute roles={["admin"]}>
              <AdminProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/change-password"
          element={
            <RoleRoute roles={["admin"]}>
              <AdminChangePassword />
            </RoleRoute>
          }
        />

        <Route
          path="/principal-dashboard"
          element={
            <RoleRoute roles={["principal"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* New Principal Portal (role-scoped) */}
        <Route
          path="/principal/dashboard"
          element={
            <RoleRoute roles={["principal"]}>
              <PrincipalDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/principal/profile"
          element={
            <RoleRoute roles={["principal"]}>
              <PrincipalProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/principal/change-password"
          element={
            <RoleRoute roles={["principal"]}>
              <PrincipalChangePassword />
            </RoleRoute>
          }
        />

        <Route
          path="/director-dashboard"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorDashboard />
            </RoleRoute>
          }
        />

        {/* Dedicated Director Portal (real-data) */}
        <Route
          path="/director/dashboard"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/director/profile"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/director/change-password"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorChangePassword />
            </RoleRoute>
          }
        />

        {/* Dedicated Director Portal (real-data, separate from admin) */}
        <Route
          path="/director/dashboard"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/director/profile"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorProfile />
            </RoleRoute>
          }
        />

        <Route
          path="/director/change-password"
          element={
            <RoleRoute roles={["director"]}>
              <DirectorChangePassword />
            </RoleRoute>
          }
        />

        {/* Compatibility alias for the existing dashboard link */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute roles={["admin", "principal", "director"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* Student dashboard */}
        <Route
          path="/student-dashboard"
          element={
            <RoleRoute roles={["student"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        {/* Student Portal (student-only) */}
        <Route
          path="/student/profile"
          element={
            <RoleRoute roles={["student"]}>
              <StudentProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <RoleRoute roles={["student"]}>
              <StudentAttendance />
            </RoleRoute>
          }
        />
        <Route
          path="/student/classes"
          element={
            <RoleRoute roles={["student"]}>
              <StudentClasses />
            </RoleRoute>
          }
        />
        <Route
          path="/student/subjects"
          element={
            <RoleRoute roles={["student"]}>
              <StudentSubjects />
            </RoleRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <RoleRoute roles={["student"]}>
              <StudentTimetable />
            </RoleRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <RoleRoute roles={["student"]}>
              <StudentResults />
            </RoleRoute>
          }
        />
        <Route
          path="/student/exams"
          element={
            <RoleRoute roles={["student"]}>
              <StudentExams />
            </RoleRoute>
          }
        />
        <Route
          path="/student/fees"
          element={
            <RoleRoute roles={["student"]}>
              <StudentFees />
            </RoleRoute>
          }
        />
        <Route
          path="/student/receipts"
          element={
            <RoleRoute roles={["student"]}>
              <StudentReceipts />
            </RoleRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <RoleRoute roles={["student"]}>
              <StudentAssignments />
            </RoleRoute>
          }
        />
        <Route
          path="/student/materials"
          element={
            <RoleRoute roles={["student"]}>
              <StudentMaterials />
            </RoleRoute>
          }
        />
        <Route
          path="/student/notices"
          element={
            <RoleRoute roles={["student"]}>
              <StudentNotices />
            </RoleRoute>
          }
        />
        <Route
          path="/student/leave"
          element={
            <RoleRoute roles={["student"]}>
              <StudentLeave />
            </RoleRoute>
          }
        />
        <Route
          path="/student/change-password"
          element={
            <RoleRoute roles={["student"]}>
              <StudentChangePassword />
            </RoleRoute>
          }
        />

        {/* Teacher dashboard */}
        <Route
          path="/teacher-dashboard"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherDashboard />
            </RoleRoute>
          }
        />

        {/* Teacher Portal pages */}
        <Route
          path="/teacher/profile"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherProfile />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherAttendance />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/classes"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherClasses />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/subjects"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherSubjects />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/timetable"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherTimetable />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherStudents />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/exams"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherExams />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/results"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherResults />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/leaves"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherLeaves />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherAssignments />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/materials"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherMaterials />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/notices"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherNotices />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/change-password"
          element={
            <RoleRoute roles={["teacher"]}>
              <TeacherChangePassword />
            </RoleRoute>
          }
        />

        {/* Module pages (role restrictions mirror the backend API) */}
        <Route
          path="/students"
          element={
            <RoleRoute roles={["teacher", "principal", "director", "admin"]}>
              <Students />
            </RoleRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <RoleRoute roles={["principal", "director", "admin"]}>
              <Teachers />
            </RoleRoute>
          }
        />

        <Route
          path="/classes"
          element={
            <RoleRoute roles={["teacher", "principal", "director", "admin"]}>
              <Classes />
            </RoleRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <RoleRoute roles={["teacher", "principal", "director", "admin"]}>
              <Attendance />
            </RoleRoute>
          }
        />

        <Route
          path="/fees"
          element={
            <RoleRoute roles={["principal", "director", "admin"]}>
              <Fees />
            </RoleRoute>
          }
        />

        <Route
          path="/results"
          element={
            <RoleRoute roles={["principal", "director", "admin"]}>
              <Results />
            </RoleRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}