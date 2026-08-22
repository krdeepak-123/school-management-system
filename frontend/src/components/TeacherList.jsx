import { useEffect, useState } from "react";
import { getTeachers } from "../api/teacherApi";

function TeacherList() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getTeachers();
      setTeachers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Teachers List</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "white" }}>
            <th style={th}>Teacher ID</th>
            <th style={th}>Name</th>
            <th style={th}>Subject</th>
            <th style={th}>Mobile</th>
            <th style={th}>Salary</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td style={td}>{teacher.teacherId}</td>
                <td style={td}>{teacher.name}</td>
                <td style={td}>{teacher.subject}</td>
                <td style={td}>{teacher.mobile}</td>
                <td style={td}>₹{teacher.salary}</td>
                <td style={td}>{teacher.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={td} colSpan="6">
                No Teacher Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default TeacherList;