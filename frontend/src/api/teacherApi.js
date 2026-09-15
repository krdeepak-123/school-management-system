import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/teachers`,
});

// GET All Teachers
export const getTeachers = () => API.get("/");

// GET Single Teacher
export const getTeacher = (id) => API.get(`/${id}`);

// CREATE Teacher
export const createTeacher = (teacherData) =>
  API.post("/", teacherData);

// UPDATE Teacher
export const updateTeacher = (id, teacherData) =>
  API.put(`/${id}`, teacherData);

// DELETE Teacher
export const deleteTeacher = (id) =>
  API.delete(`/${id}`);