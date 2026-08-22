export default function FeeTable({
  fees = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-container">

      {fees.length === 0 ? (
        <div className="empty-data">
          <h3>No Fees Found</h3>

          <p>
            Click "Add Fee" to create a fee record.
          </p>
        </div>
      ) : (
        <table className="student-table">

          <thead>
            <tr>
              <th>Fee ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Total Fee</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Payment Date</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((item, index) => (
              <tr key={item._id || index}>

                {/* Fee ID */}
                <td>
                  {item.feeId || "-"}
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

                {/* Total Fee */}
                <td>
                  ₹{Number(item.totalFee || 0).toLocaleString()}
                </td>

                {/* Paid */}
                <td>
                  ₹{Number(item.paidAmount || 0).toLocaleString()}
                </td>

                {/* Due */}
                <td>
                  ₹{Number(item.dueAmount || 0).toLocaleString()}
                </td>

                {/* Payment Date */}
                <td>
                  {item.paymentDate
                    ? new Date(
                        item.paymentDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                {/* Payment Mode */}
                <td>
                  {item.paymentMode || "-"}
                </td>

                {/* Status */}
                <td>
                  {item.status === "Paid" ? (
                    <span className="status-active">
                      🟢 Paid
                    </span>
                  ) : item.status === "Partial" ? (
                    <span className="status-leave">
                      🟡 Partial
                    </span>
                  ) : (
                    <span className="status-inactive">
                      🔴 Pending
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