import api from "./api";

// MY NOTICES (audience All/Students)
export const getMyNotices = async () => {
  const res = await api.get("/notices/mine");
  return res.data.data;
};

// All Notices (staff)
export const getNotices = async () => {
  const res = await api.get("/notices");
  return res.data.data;
};

// Add Notice (staff)
export const addNotice = async (data) => {
  const res = await api.post("/notices", data);
  return res.data.data;
};

// Update Notice (staff)
export const updateNotice = async (id, data) => {
  const res = await api.put(`/notices/${id}`, data);
  return res.data.data;
};

// Delete Notice (staff)
export const deleteNotice = async (id) => {
  await api.delete(`/notices/${id}`);
};
