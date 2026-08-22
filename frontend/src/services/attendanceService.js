import api from "./api";

// ==========================
// GET ALL ATTENDANCE
// ==========================
export const getAttendance = () => {
  return api.get("/attendance");
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