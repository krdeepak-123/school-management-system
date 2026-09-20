import api from "./api";

// MY STUDY MATERIALS (own class/section)
export const getMyMaterials = async () => {
  const res = await api.get("/materials/mine");
  return res.data.data;
};

// All Study Materials (staff)
export const getMaterials = async () => {
  const res = await api.get("/materials");
  return res.data.data;
};

// Add Study Material (staff)
export const addMaterial = async (data) => {
  const res = await api.post("/materials", data);
  return res.data.data;
};

// Update Study Material (staff)
export const updateMaterial = async (id, data) => {
  const res = await api.put(`/materials/${id}`, data);
  return res.data.data;
};

// Delete Study Material (staff)
export const deleteMaterial = async (id) => {
  await api.delete(`/materials/${id}`);
};
