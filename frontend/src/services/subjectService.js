import api from "./api";

// MY SUBJECTS (own class/section)
export const getMySubjects = async () => {
  const res = await api.get("/subjects/mine");
  return res.data.data;
};

// MY SUBJECTS (teachers — assigned subjects only)
export const getMyTeacherSubjects = async () => {
  const res = await api.get("/subjects/teacher-mine");
  return res.data.data;
};

// All Subjects (staff)
export const getSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data.data;
};

// Add Subject (staff)
export const addSubject = async (data) => {
  const res = await api.post("/subjects", data);
  return res.data.data;
};

// Update Subject (staff)
export const updateSubject = async (id, data) => {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data.data;
};

// Delete Subject (staff)
export const deleteSubject = async (id) => {
  await api.delete(`/subjects/${id}`);
};
