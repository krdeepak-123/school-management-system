import { useState, useEffect } from "react";

import {
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/teacherService";

import TeacherForm from "../components/teachers/TeacherForm";
import TeacherTable from "../components/teachers/TeacherTable";
import TeacherSearch from "../components/teachers/TeacherSearch";
import TeacherModal from "../components/teachers/TeacherModal";

import "../styles/teachers.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);

  const [viewTeacher, setViewTeacher] = useState(null);

  // Load Teachers
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Save Teacher
  const handleSave = async (teacher) => {
  try {
    if (editingTeacher) {
      await updateTeacher(editingTeacher._id, teacher);
    } else {
      await addTeacher(teacher);
    }

    await loadTeachers();

    setEditingTeacher(null);
    setIsModalOpen(false);

  } catch (error) {
    console.log(error.response?.data || error);
    alert(error.response?.data?.message || "Something went wrong");
  }
};

  // Edit
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = async (teacher) => {
  if (!window.confirm(`Delete ${teacher.name}?`)) return;

  try {
    await deleteTeacher(teacher._id);
    loadTeachers();
  } catch (error) {
    console.log(error);
  }
};

  // Search
  const filteredTeachers = teachers.filter((teacher) => {
    const text = search.toLowerCase();

    return (
      teacher.name?.toLowerCase().includes(text) ||
      teacher.employeeId?.toLowerCase().includes(text) ||
      teacher.subject?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h1>👨‍🏫 Teacher Management</h1>

        <button
          className="add-btn"
          onClick={() => {
            setEditingTeacher(null);
            setIsModalOpen(true);
          }}
        >
          + Add Teacher
        </button>
      </div>

      <TeacherSearch
        search={search}
        setSearch={setSearch}
      />

      <TeacherTable
        teachers={filteredTeachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(teacher) => setViewTeacher(teacher)}
      />

      <TeacherModal
        isOpen={isModalOpen}
        title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
        onClose={() => {
          setEditingTeacher(null);
          setIsModalOpen(false);
        }}
      >
        <TeacherForm
          onSave={handleSave}
          teacherData={editingTeacher}
        />
      </TeacherModal>

      {viewTeacher && (
        <TeacherModal
          isOpen={true}
          title="Teacher Profile"
          onClose={() => setViewTeacher(null)}
        >
          <div className="student-profile">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={
                  viewTeacher.photo
                    ? `${import.meta.env.VITE_API_URL}/${viewTeacher.photo}`
                    : "https://via.placeholder.com/150"
                }
                alt={viewTeacher.name}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #2563eb",
                }}
              />

              <h2 style={{ marginTop: "10px" }}>
                {viewTeacher.name}
              </h2>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td><b>Teacher ID</b></td>
                  <td>{viewTeacher.employeeId}</td>
                </tr>

                <tr>
                  <td><b>Father Name</b></td>
                  <td>{viewTeacher.fatherName}</td>
                </tr>

                <tr>
                  <td><b>Subject</b></td>
                  <td>{viewTeacher.subject}</td>
                </tr>

                <tr>
                  <td><b>Qualification</b></td>
                  <td>{viewTeacher.qualification}</td>
                </tr>

                <tr>
                  <td><b>Experience</b></td>
                  <td>{viewTeacher.experience} Year</td>
                </tr>

                <tr>
                  <td><b>Mobile</b></td>
                  <td>{viewTeacher.mobile}</td>
                </tr>

                <tr>
                  <td><b>Email</b></td>
                  <td>{viewTeacher.email}</td>
                </tr>

                <tr>
                  <td><b>Salary</b></td>
                  <td>₹ {viewTeacher.salary}</td>
                </tr>

                <tr>
                  <td><b>Address</b></td>
                  <td>{viewTeacher.address}</td>
                </tr>

                <tr>
                  <td><b>Status</b></td>
                  <td>
                    {viewTeacher.status === "Active"
                      ? "🟢 Active"
                      : "🔴 Inactive"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TeacherModal>
      )}
    </div>
  );
}

