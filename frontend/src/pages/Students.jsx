import { useState, useEffect } from "react";

import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";

import StudentForm from "../components/students/StudentForm";
import StudentTable from "../components/students/StudentTable";
import StudentSearch from "../components/students/StudentSearch";
import StudentModal from "../components/students/StudentModal";

import "../styles/students.css";

export default function Students() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);

  // Load Students From API
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  // Add / Update Student
  const handleSave = async (student) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, student);
        setEditingStudent(null);
      } else {
        await addStudent(student);
      }

      await loadStudents();
      setIsModalOpen(false);
    } catch (error) {
  console.log(error.response?.data);
  alert(error.response?.data?.message);
}
  };

  // Edit
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = async (student) => {
    if (window.confirm(`Delete ${student.name}?`)) {
      try {
        await deleteStudent(student._id);
        await loadStudents();
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  // Search
  const filteredStudents = students.filter((student) => {
    const text = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(text) ||
      student.rollNo?.toLowerCase().includes(text) ||
      student.admissionNo?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="students-page">
      <div className="students-header">
        <h1>👨‍🎓 Student Management</h1>

        <button
          className="add-btn"
          onClick={() => {
            setEditingStudent(null);
            setIsModalOpen(true);
          }}
        >
          + Add Student
        </button>
      </div>

      <StudentSearch
        search={search}
        setSearch={setSearch}
      />

      <StudentTable
        students={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(student) => setViewStudent(student)}
      />

      <StudentModal
        isOpen={isModalOpen}
        title={editingStudent ? "Edit Student" : "Add Student"}
        onClose={() => {
          setEditingStudent(null);
          setIsModalOpen(false);
        }}
      >
        <StudentForm
          onSave={handleSave}
          studentData={editingStudent}
        />
      </StudentModal>

      {viewStudent && (
  <StudentModal
    isOpen={true}
    title="Student Profile"
    onClose={() => setViewStudent(null)}
  >
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={
            viewStudent.photo
              ? `${import.meta.env.VITE_API_URL}/${viewStudent.photo}`
              : "https://via.placeholder.com/150"
          }
          alt={viewStudent.name}
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #2563eb",
          }}
        />

        <h2 style={{ marginTop: "15px" }}>
          {viewStudent.name}
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
            <td><b>Admission No</b></td>
            <td>{viewStudent.admissionNo}</td>
          </tr>

          <tr>
            <td><b>Roll No</b></td>
            <td>{viewStudent.rollNo}</td>
          </tr>

          <tr>
            <td><b>Class</b></td>
            <td>{viewStudent.className}</td>
          </tr>

          <tr>
            <td><b>Section</b></td>
            <td>{viewStudent.section}</td>
          </tr>

          <tr>
            <td><b>Father Name</b></td>
            <td>{viewStudent.fatherName}</td>
          </tr>

          <tr>
            <td><b>Mother Name</b></td>
            <td>{viewStudent.motherName}</td>
          </tr>

          <tr>
            <td><b>Date of Birth</b></td>
            <td>
              {viewStudent.dob
                ? new Date(viewStudent.dob).toLocaleDateString()
                : "-"}
            </td>
          </tr>

          <tr>
            <td><b>Gender</b></td>
            <td>{viewStudent.gender}</td>
          </tr>

          <tr>
            <td><b>Mobile</b></td>
            <td>{viewStudent.mobile}</td>
          </tr>

          <tr>
            <td><b>Email</b></td>
            <td>{viewStudent.email}</td>
          </tr>

          <tr>
            <td><b>Address</b></td>
            <td>{viewStudent.address}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td>
              {viewStudent.status === "Active"
                ? "🟢 Active"
                : "🔴 Inactive"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </StudentModal>
)}
    </div>
  );
}