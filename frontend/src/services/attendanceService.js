import api from "./api";

// ==========================
// GET ALL ATTENDANCE
// ==========================
export const getAttendance = () => {
  return api.get("/attendance");
};

// ==========================
// GET MY ATTENDANCE (own records)
// ==========================
export const getMyAttendance = async () => {
  const res = await api.get("/attendance/mine");
  return res.data.data;
};

// ==========================
// GET MY ATTENDANCE RECORDS (teachers —
// records of their assigned classes)
// ==========================
export const getMyTeacherAttendance = async () => {
  const res = await api.get("/attendance/teacher-mine");
  return res.data.data;
};

// ==========================
// ADD ATTENDANCE
// ==========================
export const addAttendance = (attendanceData) => {
  return api.post("/attendance", attendanceData);
};

// ==========================
// UPDATE ATTENDANCE
// ==========================
export const updateAttendance = (id, attendanceData) => {
  return api.put(`/attendance/${id}`, attendanceData);
};

// ==========================
// DELETE ATTENDANCE
// ==========================
export const deleteAttendance = (id) => {
  return api.delete(`/attendance/${id}`);
};