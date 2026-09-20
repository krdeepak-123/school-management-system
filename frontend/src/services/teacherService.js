import api from "./api";

// ==============================
// MY PROFILE (teachers — own record)
// ==============================
export const getMyTeacherProfile = async () => {
  const res = await api.get("/teachers/me");
  return res.data.data;
};

// ==============================
// UPDATE MY PROFILE (permitted fields only:
// mobile, address, qualification, photo)
// ==============================
export const updateMyTeacherProfile = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "photo") {
      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      }
    } else if (key !== "photoPreview" && key !== "photoName") {
      formData.append(key, data[key]);
    }
  });

  const res = await api.put("/teachers/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

// ==============================
// Get All Teachers
// ==============================
export const getTeachers = async () => {
  const res = await api.get("/teachers");
  return res.data.data;
};

// ==============================
// Get Single Teacher
// ==============================
export const getTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
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

  const res = await api.post("/teachers", formData, {
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

  const res = await api.put(`/teachers/${id}`, formData, {
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
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};