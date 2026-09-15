import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/teachers`;

// ==============================
// Get All Teachers
// ==============================
export const getTeachers = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// ==============================
// Get Single Teacher
// ==============================
export const getTeacher = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
};

// ==============================
// Add Teacher
// ==============================
export const addTeacher = async (teacher) => {
  const formData = new FormData();

  Object.keys(teacher).forEach((key) => {
    if (teacher[key] !== null && teacher[key] !== undefined) {
      formData.append(key, teacher[key]);
    }
  });

  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

// ==============================
// Update Teacher
// ==============================
export const updateTeacher = async (id, teacher) => {
  const formData = new FormData();

  Object.keys(teacher).forEach((key) => {
    if (teacher[key] !== null && teacher[key] !== undefined) {
      formData.append(key, teacher[key]);
    }
  });

  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

// ==============================
// Delete Teacher
// ==============================
export const deleteTeacher = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};