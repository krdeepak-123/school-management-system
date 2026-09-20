import api from "./api";

// ==========================================
// GET ALL FEES
// ==========================================
export const getFees = async () => {
  const res = await api.get("/fees");
  return res.data.data;
};

// ==========================================
// GET MY FEES (own records)
// ==========================================
export const getMyFees = async () => {
  const res = await api.get("/fees/mine");
  return res.data.data;
};

// ==========================================
// GET SINGLE FEE
// ==========================================
export const getFee = async (id) => {
  const res = await api.get(`/fees/${id}`);
  return res.data.data;
};

// ==========================================
// ADD FEE
// ==========================================
export const addFee = async (feeData) => {
  const res = await api.post("/fees", feeData);
  return res.data.data;
};

// ==========================================
// UPDATE FEE
// ==========================================
export const updateFee = async (id, feeData) => {
  const res = await api.put(`/fees/${id}`, feeData);
  return res.data.data;
};

// ==========================================
// DELETE FEE
// ==========================================
export const deleteFee = async (id) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data;
};