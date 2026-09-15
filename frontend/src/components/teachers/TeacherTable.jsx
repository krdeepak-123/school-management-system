export default function TeacherTable({
  teachers = [],
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Experience</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Teacher Found
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr key={teacher._id}>
                {/* PHOTO */}
                <td>
                  <img
                    src={
                      teacher.photo
                        ? `${import.meta.env.VITE_API_URL}/${teacher.photo}`
                        : "https://via.placeholder.com/50"
                    }
                    alt="teacher"
                    width="50"
                    height="50"
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>

                {/* TEACHER ID */}
                <td>{teacher.teacherId}</td>

                {/* NAME */}
                <td>{teacher.name}</td>

                {/* DEPARTMENT */}
                <td>{teacher.department}</td>

                {/* SUBJECT */}
                <td>{teacher.subject}</td>

                {/* EXPERIENCE */}
                <td>{teacher.experience}</td>

                {/* MOBILE */}
                <td>{teacher.mobile}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={
                      teacher.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {teacher.status}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  <div className="teacher-actions">

                    <button
                      type="button"
                      className="action-btn view-btn"
                      onClick={() => onView(teacher)}
                    >
                      👁 View
                    </button>

                    <button
                      type="button"
                      className="action-btn edit-btn"
                      onClick={() => onEdit(teacher)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      type="button"
                      className="action-btn delete-btn"
                      onClick={() => onDelete(teacher)}
                    >
                      🗑 Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}