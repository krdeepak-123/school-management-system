import api from "./api";

// MY TIMETABLE (own class/section)
export const getMyTimetable = async () => {
  const res = await api.get("/timetable/mine");
  return res.data.data;
};

// All Timetables (staff)
export const getTimetables = async () => {
  const res = await api.get("/timetable");
  return res.data.data;
};

// Add Timetable (staff)
export const addTimetable = async (data) => {
  const res = await api.post("/timetable", data);
  return res.data.data;
};

// Update Timetable (staff)
export const updateTimetable = async (id, data) => {
  const res = await api.put(`/timetable/${id}`, data);
  return res.data.data;
};

// Delete Timetable (staff)
export const deleteTimetable = async (id) => {
  await api.delete(`/timetable/${id}`);
};
