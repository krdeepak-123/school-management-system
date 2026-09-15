import { useState, useEffect } from "react";

export default function StudentForm({ onSave, studentData }) {
  const generateAdmissionNo = () => {
    return `ADM${Date.now()}`;
  };

  const emptyStudent = {
    admissionNo: generateAdmissionNo(),
    name: "",
    fatherName: "",
    motherName: "",
    rollNo: "",
    className: "",
    section: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",
    address: "",
    photo: null,
    photoPreview: "",
    photoName: "",
    status: "Active",
  };

  const [student, setStudent] = useState(emptyStudent);

  useEffect(() => {
  if (studentData) {
    setStudent({
      ...studentData,
      dob: studentData.dob
        ? studentData.dob.substring(0, 10)
        : "",
      photo: null,
      photoPreview: studentData.photo
        ? `${import.meta.env.VITE_API_URL}/${studentData.photo}`
        : "",
      photoName: "",
    });
  } else {
    setStudent({
      ...emptyStudent,
      admissionNo: generateAdmissionNo(),
    });
  }
}, [studentData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];

      if (file) {
        setStudent({
          ...student,
          photo: file,
          photoName: file.name,
          photoPreview: URL.createObjectURL(file),
        });
      }
    } else {
      setStudent({
        ...student,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!student.name || !student.rollNo || !student.className) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(student);

    if (!studentData) {
      setStudent({
        ...emptyStudent,
        admissionNo: generateAdmissionNo(),
      });
    }
  };

  const handleReset = () => {
    setStudent({
      ...emptyStudent,
      admissionNo: generateAdmissionNo(),
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>
        {studentData ? "Edit Student" : "Add Student"}
      </h2>

      <input
        name="admissionNo"
        value={student.admissionNo}
        readOnly
      />

      <input
        name="name"
        placeholder="Student Name"
        value={student.name}
        onChange={handleChange}
      />

      <input
        name="fatherName"
        placeholder="Father Name"
        value={student.fatherName}
        onChange={handleChange}
      />

      <input
        name="motherName"
        placeholder="Mother Name"
        value={student.motherName}
        onChange={handleChange}
      />

      <input
        name="rollNo"
        placeholder="Roll Number"
        value={student.rollNo}
        onChange={handleChange}
      />

      <select
        name="className"
        value={student.className}
        onChange={handleChange}
      >
        <option value="">Select Class</option>
        <option>Nursery</option>
        <option>LKG</option>
        <option>UKG</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
      </select>

      <select
        name="section"
        value={student.section}
        onChange={handleChange}
      >
        <option value="">Select Section</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>

      <input
        type="date"
        name="dob"
        value={student.dob}
        onChange={handleChange}
      />

      <select
        name="gender"
        value={student.gender}
        onChange={handleChange}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input
        name="mobile"
        placeholder="Mobile Number"
        value={student.mobile}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={student.email}
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Address"
        value={student.address}
        onChange={handleChange}
      />

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleChange}
      />

      {(student.photoPreview || student.photo) && (
        <div className="photo-preview">
          <img
            src={
              student.photoPreview
                ? student.photoPreview
                : `${import.meta.env.VITE_API_URL}/uploads/students/${student.photo}`
            }
            alt="Student"
            width="120"
            height="120"
            style={{
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          />
        </div>
      )}

      <select
        name="status"
        value={student.status}
        onChange={handleChange}
      >
        <option value="Active">🟢 Active</option>
        <option value="Inactive">🔴 Inactive</option>
      </select>

      <div className="form-buttons">
        <button
          type="submit"
          className="save-btn"
        >
          {studentData ? "Update Student" : "Save Student"}
        </button>

        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
}