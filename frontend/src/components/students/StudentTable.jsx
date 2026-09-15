export default function StudentTable({
  students = [],
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="table-container">
      {students.length === 0 ? (
        <div className="empty-data">
          <h3>No Students Found</h3>
          <p>Click "Add Student" to create your first student.</p>
        </div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Admission No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Father Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Status</th>
              <th width="230">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student._id || index}>
                <td>
                  {student.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${student.photo}`}
                      alt={student.name}
                      className="table-photo"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="table-photo default-photo"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "#ddd",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      👤
                    </div>
                  )}
                </td>

                <td>{student.admissionNo}</td>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.className}</td>
                <td>{student.section}</td>
                <td>{student.fatherName}</td>
                <td>{student.mobile}</td>
                <td>{student.email}</td>

                <td>
                  {student.status === "Active" ? (
                    <span className="status-active">🟢 Active</span>
                  ) : (
                    <span className="status-inactive">🔴 Inactive</span>
                  )}
                </td>

                <td className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => onView(student)}
                  >
                    👁 View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => onEdit(student)}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(student)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}