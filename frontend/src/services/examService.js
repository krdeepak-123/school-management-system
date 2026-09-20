import api from "./api";

// MY EXAMS (own class/section)
export const getMyExams = async () => {
  const res = await api.get("/exams/mine");
  return res.data.data;
};

// All Exams (staff)
export const getExams = async () => {
  const res = await api.get("/exams");
  return res.data.data;
};

// Add Exam (staff)
export const addExam = async (data) => {
  const res = await api.post("/exams", data);
  return res.data.data;
};

// Update Exam (staff)
export const updateExam = async (id, data) => {
  const res = await api.put(`/exams/${id}`, data);
  return res.data.data;
};

// Delete Exam (staff)
export const deleteExam = async (id) => {
  await api.delete(`/exams/${id}`);
};
