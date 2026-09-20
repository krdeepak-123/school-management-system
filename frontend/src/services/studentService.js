import api from "./api";

// ==============================
// MY STUDENTS (teachers — students of
// assigned classes only)
// ==============================
export const getMyTeacherStudents = async () => {
  const res = await api.get("/students/teacher-mine");
  return res.data.data;
};

// ==============================
// MY PROFILE (students — own record)
// ==============================
export const getMyProfile = async () => {
  const res = await api.get("/students/me");
  return res.data.data;
};

// ==============================
// UPDATE MY PROFILE (permitted fields
// only: mobile, address, photo)
// ==============================
export const updateMyProfile = async (data) => {
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

  const res = await api.put("/students/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

// ==============================
// Get All Students
// ==============================
export const getStudents = async () => {
  const res = await api.get("/students");
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

  const res = await api.post("/students", formData, {
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

  const res = await api.put(`/students/${id}`, formData, {
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
  await api.delete(`/students/${id}`);
};

// ==============================
// Get Single Student
// ==============================
export const getStudent = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data.data;
};