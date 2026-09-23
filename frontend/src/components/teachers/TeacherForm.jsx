import { useState, useEffect } from "react";

export default function TeacherForm({ onSave, teacherData }) {

//   const generateTeacherId = () => {
//   return `EMP${Date.now()}`;
// };

  const emptyTeacher = {
    teacherId: "",
    name: "",
    fatherName: "",
    motherName: "",
    department: "",
    dob: "",
    subject: "",
    qualification: "",
    experience: "",
    gender: "",
    mobile: "",
    email: "",
    salary: "",
    joiningDate: "",
    address: "",
    status: "Active",
    photo: null,
    photoPreview: "",
  };

  const [teacher, setTeacher] = useState(emptyTeacher);

  useEffect(() => {
  if (teacherData) {
    setTeacher({
      ...emptyTeacher,
      ...teacherData,
      joiningDate: teacherData.joiningDate
        ? teacherData.joiningDate.substring(0, 10)
        : "",
      dob: teacherData.dob
        ? teacherData.dob.substring(0, 10)
        : "",
      photoPreview: "",
    });
  } else {
    setTeacher({
      ...emptyTeacher,
      // teacherId: generateTeacherId(),
      teacherId: "",
    });
  }
}, [teacherData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];

      if (file) {
        setTeacher({
          ...teacher,
          photo: file,
          photoPreview: URL.createObjectURL(file),
        });
      }
    } else {
      setTeacher({
        ...teacher,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   if (
  !teacher.name ||
  !teacher.subject ||
  !teacher.gender ||
  !teacher.mobile
) {
      alert("Please fill all required fields.");
      return;
    }

    teacher.teacherId = teacher.teacherId.toUpperCase();
teacher.name = teacher.name.trim();
teacher.subject = teacher.subject.trim();
teacher.department = teacher.department.trim();
teacher.email = teacher.email.toLowerCase();
    onSave(teacher);

    if (!teacherData) {
      setTeacher({
        ...emptyTeacher,
        teacherId:"",
      });
    }
  };

  const handleReset = () => {
    setTeacher({
      ...emptyTeacher,
      teacherId: "",
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>

      <h2>
        {teacherData ? "Edit Teacher" : "Add Teacher"}
      </h2>

      {/* <input
       name="teacherId"
       value={teacher.teacherId ||""}
        readOnly
      /> */}

      <input
        name="name"
        placeholder="Teacher Name"
        value={teacher.name ||""}
        onChange={handleChange}
      />

      <input
        name="fatherName"
        placeholder="Father Name"
        value={teacher.fatherName ||""}
        onChange={handleChange}
      />

      <input
        name="motherName"
        placeholder="Mother Name"
        value={teacher.motherName ||""}
        onChange={handleChange}
      />

      <input
        name="subject"
        placeholder="Subject"
        value={teacher.subject ||""}
        onChange={handleChange}
      />

      <input
        name="qualification"
        placeholder="Qualification"
        value={teacher.qualification ||""}
        onChange={handleChange}
      />

      <input
        name="department"
        placeholder="Department"
        value={teacher.department ||""}
        onChange={handleChange}
      />

      <input
        type="number"
        name="experience"
        placeholder="Experience (Years)"
        value={teacher.experience ?? ""}
        onChange={handleChange}
      />
      <select
        name="gender"
        value={teacher.gender ||""}
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
        value={teacher.mobile ||""}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={teacher.email ||""}
        onChange={handleChange}
      />

      <input
        type="number"
        name="salary"
        placeholder="Salary"
        value={teacher.salary ||""}
        onChange={handleChange}
      />

      <input
        type="date"
        name="joiningDate"
        value={teacher.joiningDate ||""}        onChange={handleChange}
      />

      <input
        type="date"
        name="dob"
        value={teacher.dob || ""}
        onChange={handleChange}
      />
      <select
        name="status"
        value={teacher.status ||""}
        onChange={handleChange}
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <textarea
        name="address"
        placeholder="Address"
        value={teacher.address ||""}
        onChange={handleChange}
      />

     <input
        type="file"
        name="photo"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
/>

  {(teacher.photoPreview || teacher.photo) && (
  <div className="photo-preview">
    <img
      src={
        teacher.photoPreview
          ? teacher.photoPreview
          : typeof teacher.photo === "string"
          ? `${import.meta.env.VITE_API_URL}/${teacher.photo}`
          : URL.createObjectURL(teacher.photo)
      }
      alt="Teacher"
      width={120}
      height={120}
      style={{
        objectFit: "cover",
        borderRadius: "10px",
        marginTop: "10px",
      }}
    />
  </div>
)}

      <div className="form-buttons">

        <button
          type="submit"
          className="save-btn"
        >
          {teacherData ? "Update Teacher" : "Save Teacher"}
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