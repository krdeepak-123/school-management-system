import api from "./api";

// MY CLASS (students — own class only)
export const getMyClass = async () => {
  const res = await api.get("/classes/mine");
  return res.data.data;
};

// MY CLASSES (teachers — assigned classes only)
export const getMyTeacherClasses = async () => {
  const res = await api.get("/classes/teacher-mine");
  return res.data.data;
};

// Get All Classes
export const getClasses = () => api.get("/classes");

// Add Class
export const addClass = (data) => api.post("/classes", data);

// Update Class
export const updateClass = (id, data) =>
  api.put(`/classes/${id}`, data);

// Delete Class
export const deleteClass = (id) =>
  api.delete(`/classes/${id}`);