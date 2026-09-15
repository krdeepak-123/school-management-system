import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/students`;

// ==============================
// Get All Students
// ==============================
export const getStudents = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// ==============================
// Add Student
// ==============================
export const addStudent = async (student) => {
  const formData = new FormData();

  Object.keys(student).forEach((key) => {
    if (key === "photo") {
      if (student.photo instanceof File) {
        formData.append("photo", student.photo);
      }
    } else if (
      key !== "photoPreview" &&
      key !== "photoName"
    ) {
      formData.append(key, student[key]);
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
// Update Student
// ==============================
export const updateStudent = async (id, student) => {
  const formData = new FormData();

  Object.keys(student).forEach((key) => {
    if (key === "photo") {
      if (student.photo instanceof File) {
        formData.append("photo", student.photo);
      }
    } else if (
      key !== "photoPreview" &&
      key !== "photoName"
    ) {
      formData.append(key, student[key]);
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
// Delete Student
// ==============================
export const deleteStudent = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// ==============================
// Get Single Student
// ==============================
export const getStudent = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
};