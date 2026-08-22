import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
axios.get(`${API_URL}/students`),
axios.get(`${API_URL}/teachers`),
axios.get(`${API_URL}/classes`),
axios.get(`${API_URL}/attendance`),
]);

return {
students: studentsRes.data.data || [],
teachers: teachersRes.data.data || [],
classes: classesRes.data.data || [],
attendance: attendanceRes.data.data || [],
};
};
