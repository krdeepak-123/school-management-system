export default function ClassTable({
  classes = [],
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="table-container">

      {classes.length === 0 ? (
        <div className="empty-data">
          <h3>No Classes Found</h3>
          <p>Click "Add Class" to create your first class.</p>
        </div>
      ) : (
        <table className="student-table">

          <thead>
            <tr>
              <th>Class ID</th>
              <th>Class</th>
              <th>Section</th>
              <th>Class Teacher</th>
              <th>Capacity</th>
              <th>Room No</th>
              <th>Status</th>
              <th width="220">Actions</th>
            </tr>
          </thead>

          <tbody>

            {classes.map((item, index) => (

              <tr key={item.classId || index}>

                <td>{item.classId}</td>
                <td>{item.className}</td>
                <td>{item.section}</td>
                <td>{item.classTeacher}</td>
                <td>{item.capacity}</td>
                <td>{item.roomNo}</td>

                <td>
                  {item.status === "Active" ? (
                    <span className="status-active">
                      🟢 Active
                    </span>
                  ) : (
                    <span className="status-inactive">
                      🔴 Inactive
                    </span>
                  )}
                </td>

                <td className="action-buttons">

                  <button
                    className="view-btn"
                    onClick={() => onView(item)}
                  >
                    👁 View
                  </button>

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