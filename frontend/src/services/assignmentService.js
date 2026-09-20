import api from "./api";

// MY ASSIGNMENTS (own class/section)
export const getMyAssignments = async () => {
  const res = await api.get("/assignments/mine");
  return res.data.data;
};

// All Assignments (staff)
export const getAssignments = async () => {
  const res = await api.get("/assignments");
  return res.data.data;
};

// Add Assignment (staff)
export const addAssignment = async (data) => {
  const res = await api.post("/assignments", data);
  return res.data.data;
};

// Update Assignment (staff)
export const updateAssignment = async (id, data) => {
  const res = await api.put(`/assignments/${id}`, data);
  return res.data.data;
};

// Delete Assignment (staff)
export const deleteAssignment = async (id) => {
  await api.delete(`/assignments/${id}`);
};
