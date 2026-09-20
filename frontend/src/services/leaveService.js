import api from "./api";

// APPLY FOR LEAVE (students)
export const applyLeave = async (data) => {
  const res = await api.post("/leaves", data);
  return res.data.data;
};

// MY LEAVE APPLICATIONS (own records)
export const getMyLeaves = async () => {
  const res = await api.get("/leaves/mine");
  return res.data.data;
};

// All Leave Applications (staff)
export const getLeaves = async () => {
  const res = await api.get("/leaves");
  return res.data.data;
};

// Approve/Reject Leave (staff)
export const updateLeave = async (id, data) => {
  const res = await api.put(`/leaves/${id}`, data);
  return res.data.data;
};

// Delete Leave (staff)
export const deleteLeave = async (id) => {
  await api.delete(`/leaves/${id}`);
};
