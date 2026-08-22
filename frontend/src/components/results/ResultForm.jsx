import { useEffect, useState } from "react";
import { getStudents } from "../../services/studentService";

const emptyForm = {
  studentName: "",
  className: "",
  section: "",
  rollNo: "",
  exam: "",
  subject: "",
  totalMarks: "",
  obtainedMarks: "",
  percentage: "",
  grade: "",
  status: "Pass",
  examDate: "",
};

export default function ResultForm({
  onSave,
  resultData,
}) {
  const [form, setForm] = useState(emptyForm);

  const [students, setStudents] = useState([]);

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();

      setStudents(data || []);
    } catch (error) {
      console.error(
        "Student Load Error:",
        error
      );

      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ==========================================
  // EDIT RESULT DATA
  // ==========================================

  useEffect(() => {
    if (resultData) {
      setForm({
        studentName:
          resultData.studentName || "",

        className:
          resultData.className || "",

        section:
          resultData.section || "",

        rollNo:
          resultData.rollNo || "",

        exam:
          resultData.exam || "",

        subject:
          resultData.subject || "",

        totalMarks:
          resultData.totalMarks ?? "",

        obtainedMarks:
          resultData.obtainedMarks ?? "",

        percentage:
          resultData.percentage ?? "",

        grade:
          resultData.grade || "",

        status:
          resultData.status || "Pass",

        examDate:
          resultData.examDate
            ? resultData.examDate.substring(
                0,
                10
              )
            : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [resultData]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Student select
    if (name === "studentName") {
      const selectedStudent =
        students.find(
          (student) =>
            student.name === value
        );

      if (selectedStudent) {
        setForm((prev) => ({
          ...prev,

          studentName:
            selectedStudent.name || "",

          className:
            selectedStudent.className || "",

          section:
            selectedStudent.section || "",

          rollNo:
            selectedStudent.rollNo || "",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          studentName: value,
        }));
      }

      return;
    }

    // Normal input
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ========================================
    // MARKS CALCULATION
    // ========================================

    if (
      name === "totalMarks" ||
      name === "obtainedMarks"
    ) {
      const total =
        name === "totalMarks"
          ? Number(value)
          : Number(form.totalMarks);

      const obtained =
        name === "obtainedMarks"
          ? Number(value)
          : Number(form.obtainedMarks);

      if (
        total > 0 &&
        obtained >= 0
      ) {
        const percentage =
          (obtained / total) * 100;

        let grade = "F";

        if (percentage >= 90) {
          grade = "A+";
        } else if (percentage >= 80) {
          grade = "A";
        } else if (percentage >= 70) {
          grade = "B+";
        } else if (percentage >= 60) {
          grade = "B";
        } else if (percentage >= 50) {
          grade = "C";
        } else if (percentage >= 33) {
          grade = "D";
        }

        const status =
          percentage >= 33
            ? "Pass"
            : "Fail";

        setForm((prev) => ({
          ...prev,

          percentage:
            Number(
              percentage.toFixed(2)
            ),

          grade,

          status,
        }));
      }
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.studentName) {
      alert("Please select student");
      return;
    }

    if (!form.exam) {
      alert("Please select examination");
      return;
    }

    if (!form.subject.trim()) {
      alert("Please enter subject");
      return;
    }

    if (
      !form.totalMarks ||
      Number(form.totalMarks) <= 0
    ) {
      alert("Please enter total marks");
      return;
    }

    if (
      form.obtainedMarks === "" ||
      Number(form.obtainedMarks) < 0
    ) {
      alert("Please enter obtained marks");
      return;
    }

    if (
      Number(form.obtainedMarks) >
      Number(form.totalMarks)
    ) {
      alert(
        "Obtained marks cannot be greater than total marks"
      );
      return;
    }

    if (!form.examDate) {
      alert("Please select exam date");
      return;
    }

    const finalData = {
      ...form,

      totalMarks:
        Number(form.totalMarks),

      obtainedMarks:
        Number(form.obtainedMarks),

      percentage:
        Number(form.percentage),
    };

    onSave(finalData);
  };

  return (
    <form
      className="result-form"
      onSubmit={handleSubmit}
    >

      {/* STUDENT */}

      <div className="form-group">
        <label>
          Student *
        </label>

        <select
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          disabled={loadingStudents}
          required
        >
          <option value="">
            {loadingStudents
              ? "Loading Students..."
              : "Select Student"}
          </option>

          {students.map((student) => (
            <option
              key={
                student._id ||
                student.name
              }
              value={student.name}
            >
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* CLASS + SECTION */}

      <div className="form-row">

        <div className="form-group">
          <label>
            Class
          </label>

          <input
            type="text"
            name="className"
            value={form.className}
            readOnly
            placeholder="Class"
          />
        </div>

        <div className="form-group">
          <label>
            Section
          </label>

          <input
            type="text"
            name="section"
            value={form.section}
            readOnly
            placeholder="Section"
          />
        </div>

      </div>

      {/* ROLL NO */}

      <div className="form-group">
        <label>
          Roll No
        </label>

        <input
          type="text"
          name="rollNo"
          value={form.rollNo}
          readOnly
          placeholder="Roll No"
        />
      </div>

      {/* EXAM */}

      <div className="form-group">
        <label>
          Examination *
        </label>

        <select
          name="exam"
          value={form.exam}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Examination
          </option>

          <option value="Unit Test">
            Unit Test
          </option>

          <option value="Half Yearly">
            Half Yearly
          </option>

          <option value="Annual">
            Annual
          </option>

          <option value="Final">
            Final
          </option>
        </select>
      </div>

      {/* SUBJECT */}

      <div className="form-group">
        <label>
          Subject *
        </label>

        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Mathematics"
          required
        />
      </div>

      {/* MARKS */}

      <div className="form-row">

        <div className="form-group">
          <label>
            Total Marks *
          </label>

          <input
            type="number"
            name="totalMarks"
            value={form.totalMarks}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Obtained Marks *
          </label>

          <input
            type="number"
            name="obtainedMarks"
            value={form.obtainedMarks}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

      </div>

      {/* RESULT CALCULATION */}

      <div className="result-calculated">

        <div>
          <span>
            Percentage
          </span>

          <strong>
            {form.percentage || 0}%
          </strong>
        </div>

        <div>
          <span>
            Grade
          </span>

          <strong>
            {form.grade || "-"}
          </strong>
        </div>

        <div>
          <span>
            Status
          </span>

          <strong>
            {form.status || "-"}
          </strong>
        </div>

      </div>

      {/* EXAM DATE */}

      <div className="form-group">
        <label>
          Exam Date *
        </label>

        <input
          type="date"
          name="examDate"
          value={form.examDate}
          onChange={handleChange}
          required
        />
      </div>

      {/* SAVE */}

      <button
        type="submit"
        className="save-result-btn"
      >
        {resultData
          ? "Update Result"
          : "Save Result"}
      </button>

    </form>
  );
}