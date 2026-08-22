export default function AttendanceTable({
  attendance = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-container">
      {attendance.length === 0 ? (
        <div className="empty-data">
          <h3>No Attendance Found</h3>

          <p>
            Click "Mark Attendance" to mark attendance.
          </p>
        </div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Attendance ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Roll No</th>
              <th>Date</th>
              <th>Status</th>
              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((item, index) => (
              <tr key={item._id || index}>
                {/* Attendance ID */}
                <td>
                  {item.attendanceId || "-"}
                </td>

                {/* Student */}
                <td>
                  {item.studentName || "-"}
                </td>

                {/* Class */}
                <td>
                  {item.className || "-"}
                </td>

                {/* Section */}
                <td>
                  {item.section || "-"}
                </td>

                {/* Roll No */}
                <td>
                  {item.rollNo || "-"}
                </td>

                {/* Date */}
                <td>
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "-"}
                </td>

                {/* Status */}
                <td>
                  {item.status === "Present" ? (
                    <span className="status-active">
                      🟢 Present
                    </span>
                  ) : item.status === "Absent" ? (
                    <span className="status-inactive">
                      🔴 Absent
                    </span>
                  ) : (
                    <span className="status-leave">
                      🟡 Late
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(item)}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(item)}
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