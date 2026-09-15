import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/classes`;

// Get All Classes
export const getClasses = () => axios.get(API);

// Add Class
export const addClass = (data) => axios.post(API, data);

// Update Class
export const updateClass = (id, data) =>
  axios.put(`${API}/${id}`, data);

// Delete Class
export const deleteClass = (id) =>
  axios.delete(`${API}/${id}`);