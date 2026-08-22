import api from "./api";

// ==========================================
// GET ALL RESULTS
// ==========================================
export const getResults = async () => {
  const response = await api.get("/results");

  return response.data?.data || [];
};

// ==========================================
// GET SINGLE RESULT
// ==========================================
export const getResultById = async (id) => {
  const response = await api.get(`/results/${id}`);

  return response.data?.data;
};

// ==========================================
// ADD RESULT
// ==========================================
export const addResult = async (resultData) => {
  const response = await api.post(
    "/results",
    resultData
  );

  return response.data?.data;
};

// ==========================================
// UPDATE RESULT
// ==========================================
export const updateResult = async (id, resultData) => {
  const response = await api.put(
    `/results/${id}`,
    resultData
  );

  return response.data?.data;
};

// ==========================================
// DELETE RESULT
// ==========================================
export const deleteResult = async (id) => {
  const response = await api.delete(
    `/results/${id}`
  );

  return response.data;
};