import { useEffect, useState } from "react";

import ClassForm from "../components/classes/ClassForm";
import ClassTable from "../components/classes/ClassTable";
import ClassSearch from "../components/classes/ClassSearch";
import ClassModal from "../components/classes/ClassModal";

import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
} from "../services/classService";

import "../styles/classes.css";

export default function Classes() {

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [viewClass, setViewClass] = useState(null);

  // ==========================
  // Load Classes
  // ==========================
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {

      const res = await getClasses();

      setClasses(res.data.data);

    } catch (err) {

      console.log(err);

    }
  };

  // ==========================
  // Save Class
  // ==========================
  const handleSave = async (classData) => {

    try {

      if (editingClass) {

        await updateClass(editingClass._id, classData);

      } else {

        await addClass(classData);

      }

      fetchClasses();

      setEditingClass(null);

    } catch (err) {

      alert(err.response?.data?.message);

    }

  };

  // ==========================
  // Delete
  // ==========================
  const handleDelete = async (item) => {

    if (!window.confirm("Delete this Class?")) return;

    await deleteClass(item._id);

    fetchClasses();

  };

  // ==========================
  // Edit
  // ==========================
  const handleEdit = (item) => {

    setEditingClass(item);

  };

  // ==========================
  // View
  // ==========================
  const handleView = (item) => {

    setViewClass(item);

  };

  // ==========================
  // Search
  // ==========================
  const filteredClasses = classes.filter((item) =>
    item.className
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      <ClassForm
        onSave={handleSave}
        classData={editingClass}
      />

      <ClassSearch
        search={search}
        setSearch={setSearch}
      />

      <ClassTable
        classes={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

     {viewClass && (
  <ClassModal
    isOpen={true}
    title="Class Details"
    onClose={() => setViewClass(null)}
  >
    <div className="student-profile">

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <tbody>

          <tr>
            <td><b>Class ID</b></td>
            <td>{viewClass.classId}</td>
          </tr>

          <tr>
            <td><b>Class Name</b></td>
            <td>{viewClass.className}</td>
          </tr>

          <tr>
            <td><b>Section</b></td>
            <td>{viewClass.section}</td>
          </tr>

          <tr>
            <td><b>Class Teacher</b></td>
            <td>{viewClass.classTeacher}</td>
          </tr>

          <tr>
            <td><b>Room No</b></td>
            <td>{viewClass.roomNo}</td>
          </tr>

          <tr>
            <td><b>Capacity</b></td>
            <td>{viewClass.capacity}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td>
              {viewClass.status === "Active"
                ? "🟢 Active"
                : "🔴 Inactive"}
            </td>
          </tr>

          <tr>
            <td><b>Created</b></td>
            <td>
              {new Date(viewClass.createdAt).toLocaleDateString()}
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  </ClassModal>
)}

    </div>
  );
}