import axios from "axios";

const API_URL = "http://localhost:5000/api/fees";

// ==========================================
// GET ALL FEES
// ==========================================
export const getFees = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// ==========================================
// GET SINGLE FEE
// ==========================================
export const getFee = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
};

// ==========================================
// ADD FEE
// ==========================================
export const addFee = async (feeData) => {
  const res = await axios.post(API_URL, feeData);
  return res.data.data;
};

// ==========================================
// UPDATE FEE
// ==========================================
export const updateFee = async (id, feeData) => {
  const res = await axios.put(`${API_URL}/${id}`, feeData);
  return res.data.data;
};

// ==========================================
// DELETE FEE
// ==========================================
export const deleteFee = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};