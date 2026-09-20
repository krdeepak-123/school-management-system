import api from "./api";

// ==============================
// GET DASHBOARD DATA
// ==============================
export const getDashboardData = async () => {
  const [
    studentsRes,
    teachersRes,
    classesRes,
    attendanceRes,
  ] = await Promise.all([
    api.get("/students"),
    api.get("/teachers"),
    api.get("/classes"),
    api.get("/attendance"),
  ]);

  return {
    students: studentsRes.data.data || [],
    teachers: teachersRes.data.data || [],
    classes: classesRes.data.data || [],
    attendance: attendanceRes.data.data || [],
  };
};