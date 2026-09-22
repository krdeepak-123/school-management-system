export default function ResultTable({
  results,
  onEdit,
  onDelete,
}) {
  // ==========================================
  // NO RESULT
  // ==========================================

  if (!results || results.length === 0) {
    return (
      <div className="no-results">

        <div className="no-results-icon">
          📝
        </div>

        <h3>
          No Results Found
        </h3>

        <p>
          Add a result to see it here.
        </p>

      </div>
    );
  }

  // ==========================================
  // TABLE
  // ==========================================

  return (
    <div className="result-table-container">

      <table className="result-table">

        <thead>

          <tr>
            <th>
              Result ID
            </th>

            <th>
              Student
            </th>

            <th>
              Class
            </th>

            <th>
              Roll No
            </th>

            <th>
              Exam
            </th>

            <th>
              Subject
            </th>

            <th>
              Marks
            </th>

            <th>
              %
            </th>

            <th>
              Grade
            </th>

            <th>
              Status
            </th>

            <th>
              Action
            </th>
          </tr>

        </thead>

        <tbody>

          {results.map((result) => (

            <tr
              key={result._id}
            >

              {/* RESULT ID */}

              <td>
                <strong>
                  {result.resultId}
                </strong>
              </td>

              {/* STUDENT */}

              <td>
                {result.studentName}
              </td>

              {/* CLASS */}

              <td>
                {result.className}

                {" - "}

                {result.section}
              </td>

              {/* ROLL */}

              <td>
                {result.rollNo}
              </td>

              {/* EXAM */}

              <td>
                {result.exam}
              </td>

              {/* SUBJECT */}

              <td>
                {result.subject}
              </td>

              {/* MARKS */}

              <td>
                {result.obtainedMarks}
                /
                {result.totalMarks}
              </td>

              {/* PERCENTAGE */}

              <td>
                {result.percentage}%
              </td>

              {/* GRADE */}

              <td>

                <span className="grade">
                  {result.grade}
                </span>

              </td>

              {/* STATUS */}

              <td>

                <span
                  className={
                    result.status ===
                    "Pass"
                      ? "status-pass"
                      : "status-fail"
                  }
                >
                  {result.status}
                </span>

              </td>

              {/* ACTION */}

              <td>

                <div className="table-actions">

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                      onEdit(result)
                    }
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      onDelete(result)
                    }
                  >
                    🗑️
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}