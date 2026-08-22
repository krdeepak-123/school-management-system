import { useState, useEffect } from "react";
import { getStudents } from "../../services/studentService";

export default function AttendanceForm({
  onSave,
  attendanceData,
}) {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [attendance, setAttendance] = useState({
    studentName: "",
    className: "",
    section: "",
    rollNo: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  // =====================================
  // LOAD STUDENTS FROM BACKEND
  // =====================================
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoadingStudents(true);

        const data = await getStudents();

        console.log("Students Loaded =", data);

        setStudents(data || []);
      } catch (error) {
        console.error("Student Load Error =", error);

        alert("Students load nahi ho rahe hain.");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  // =====================================
  // EDIT ATTENDANCE
  // =====================================
  useEffect(() => {
    if (attendanceData) {
      setAttendance({
        studentName: attendanceData.studentName || "",
        className: attendanceData.className || "",
        section: attendanceData.section || "",
        rollNo: attendanceData.rollNo || "",
        date: attendanceData.date
          ? new Date(attendanceData.date)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: attendanceData.status || "Present",
      });
    } else {
      setAttendance({
        studentName: "",
        className: "",
        section: "",
        rollNo: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });
    }
  }, [attendanceData]);

  // =====================================
  // STUDENT CHANGE
  // =====================================
  const handleStudentChange = (e) => {
    const name = e.target.value;

    const student = students.find(
      (item) => item.name === name
    );

    console.log("Selected Student =", student);

    if (student) {
      setAttendance({
        ...attendance,
        studentName: student.name || "",
        className: student.className || "",
        section: student.section || "",
        rollNo: student.rollNo || "",
      });
    } else {
      setAttendance({
        ...attendance,
        studentName: "",
        className: "",
        section: "",
        rollNo: "",
      });
    }
  };

  // =====================================
  // INPUT CHANGE
  // =====================================
  const handleChange = (e) => {
    setAttendance({
      ...attendance,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!attendance.studentName) {
      alert("Please select student");
      return;
    }

    if (!attendance.className) {
      alert("Class information not found");
      return;
    }

    if (!attendance.section) {
      alert("Section information not found");
      return;
    }

    if (!attendance.date) {
      alert("Please select date");
      return;
    }

    console.log("Attendance Data =", attendance);

    onSave(attendance);
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>
        {attendanceData
          ? "Edit Attendance"
          : "Mark Attendance"}
      </h2>

      {/* ==========================
          ATTENDANCE ID
      ========================== */}

      {attendanceData?.attendanceId && (
        <input
          type="text"
          value={attendanceData.attendanceId}
          readOnly
          placeholder="Attendance ID"
        />
      )}

      {/* ==========================
          STUDENT
      ========================== */}

      <select
        value={attendance.studentName}
        onChange={handleStudentChange}
        disabled={loadingStudents}
      >
        <option value="">
          {loadingStudents
            ? "Loading Students..."
            : "Select Student"}
        </option>

        {students.map((student) => (
          <option
            key={student._id}
            value={student.name}
          >
            {student.name}
          </option>
        ))}
      </select>

      {/* ==========================
          CLASS
      ========================== */}

      <input
        type="text"
        value={attendance.className}
        readOnly
        placeholder="Class"
      />

      {/* ==========================
          SECTION
      ========================== */}

      <input
        type="text"
        value={attendance.section}
        readOnly
        placeholder="Section"
      />

      {/* ==========================
          ROLL NO
      ========================== */}

      <input
        type="text"
        value={attendance.rollNo}
        readOnly
        placeholder="Roll No"
      />

      {/* ==========================
          DATE
      ========================== */}

      <input
        type="date"
        name="date"
        value={attendance.date}
        onChange={handleChange}
      />

      {/* ==========================
          STATUS
      ========================== */}

      <select
        name="status"
        value={attendance.status}
        onChange={handleChange}
      >
        <option value="Present">
          Present
        </option>

        <option value="Absent">
          Absent
        </option>

        <option value="Leave">
          Leave
        </option>
      </select>

      {/* ==========================
          BUTTON
      ========================== */}

      <div className="form-buttons">

        <button
          type="submit"
          className="save-btn"
        >
          {attendanceData
            ? "Update Attendance"
            : "Save Attendance"}
        </button>

      </div>

    </form>
  );
}