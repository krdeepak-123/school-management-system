import { useState, useEffect } from "react";

export default function ClassForm({
  onSave,
  classData,
}) {
  const generateClassId = () => {
    const classes =
      JSON.parse(localStorage.getItem("classes")) || [];

    const next = classes.length + 1;

    return `CLS${String(next).padStart(3, "0")}`;
  };

  const emptyClass = {
    classId: generateClassId(),
    className: "",
    section: "",
    classTeacher: "",
    capacity: "",
    roomNo: "",
    status: "Active",
  };

  const [classItem, setClassItem] = useState(emptyClass);

  useEffect(() => {
    if (classData) {
      setClassItem(classData);
    } else {
      setClassItem({
        ...emptyClass,
        classId: generateClassId(),
      });
    }
  }, [classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClassItem({
      ...classItem,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !classItem.className ||
      !classItem.section ||
      !classItem.classTeacher
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(classItem);

    if (!classData) {
      setClassItem({
        ...emptyClass,
        classId: generateClassId(),
      });
    }
  };

  const handleReset = () => {
    setClassItem({
      ...emptyClass,
      classId: generateClassId(),
    });
  };

  return (
    <form
      className="student-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {classData
          ? "Edit Class"
          : "Add Class"}
      </h2>

      <input
        name="classId"
        value={classItem.classId}
        readOnly
      />

      <select
        name="className"
        value={classItem.className}
        onChange={handleChange}
      >
        <option value="">
          Select Class
        </option>
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
        value={classItem.section}
        onChange={handleChange}
      >
        <option value="">
          Select Section
        </option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>

      <input
        name="classTeacher"
        placeholder="Class Teacher"
        value={classItem.classTeacher}
        onChange={handleChange}
      />

      <input
        type="number"
        name="capacity"
        placeholder="Student Capacity"
        value={classItem.capacity}
        onChange={handleChange}
      />

      <input
        name="roomNo"
        placeholder="Room Number"
        value={classItem.roomNo}
        onChange={handleChange}
      />

      <select
        name="status"
        value={classItem.status}
        onChange={handleChange}
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <div className="form-buttons">
        <button
          type="submit"
          className="save-btn"
        >
          {classData
            ? "Update Class"
            : "Save Class"}
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