import { useEffect, useState } from "react";

export default function FeeForm({
  onSave,
  feeData,
}) {
  const emptyFee = {
    studentName: "",
    className: "",
    section: "",
    rollNo: "",
    totalFee: "",
    paidAmount: "",
    paymentDate: new Date()
      .toISOString()
      .split("T")[0],
    paymentMode: "Cash",
  };

  const [fee, setFee] = useState(emptyFee);

  // ==========================================
  // LOAD EDIT DATA
  // ==========================================
  useEffect(() => {
    if (feeData) {
      setFee({
        studentName: feeData.studentName || "",
        className: feeData.className || "",
        section: feeData.section || "",
        rollNo: feeData.rollNo || "",
        totalFee: feeData.totalFee ?? "",
        paidAmount: feeData.paidAmount ?? "",
        paymentDate: feeData.paymentDate
          ? new Date(feeData.paymentDate)
              .toISOString()
              .split("T")[0]
          : new Date()
              .toISOString()
              .split("T")[0],
        paymentMode:
          feeData.paymentMode || "Cash",
      });
    } else {
      setFee(emptyFee);
    }
  }, [feeData]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fee.studentName) {
      alert("Please enter student name");
      return;
    }

    if (!fee.className) {
      alert("Please enter class");
      return;
    }

    if (!fee.section) {
      alert("Please enter section");
      return;
    }

    if (
      fee.totalFee === "" ||
      Number(fee.totalFee) <= 0
    ) {
      alert("Please enter valid total fee");
      return;
    }

    if (
      fee.paidAmount === "" ||
      Number(fee.paidAmount) < 0
    ) {
      alert("Please enter valid paid amount");
      return;
    }

    if (
      Number(fee.paidAmount) >
      Number(fee.totalFee)
    ) {
      alert(
        "Paid amount cannot be greater than total fee"
      );
      return;
    }

    const feeDataToSave = {
      studentName: fee.studentName,
      className: fee.className,
      section: fee.section,
      rollNo: fee.rollNo,
      totalFee: Number(fee.totalFee),
      paidAmount: Number(fee.paidAmount),
      paymentDate: fee.paymentDate,
      paymentMode: fee.paymentMode,
    };

    onSave(feeDataToSave);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="student-form"
    >

      <h2>
        {feeData
          ? "Edit Fee"
          : "Add Fee"}
      </h2>

      {/* ==================================
          STUDENT NAME
      ================================== */}

      <div className="form-group">

        <label>
          Student Name *
        </label>

        <input
          type="text"
          name="studentName"
          value={fee.studentName}
          onChange={handleChange}
          placeholder="Enter student name"
          required
        />

      </div>

      {/* ==================================
          CLASS
      ================================== */}

      <div className="form-group">

        <label>
          Class *
        </label>

        <input
          type="text"
          name="className"
          value={fee.className}
          onChange={handleChange}
          placeholder="Enter class"
          required
        />

      </div>

      {/* ==================================
          SECTION
      ================================== */}

      <div className="form-group">

        <label>
          Section *
        </label>

        <input
          type="text"
          name="section"
          value={fee.section}
          onChange={handleChange}
          placeholder="Enter section"
          required
        />

      </div>

      {/* ==================================
          ROLL NUMBER (optional — used to
          match the fee to a student account)
      ================================== */}

      <div className="form-group">

        <label>
          Roll Number
        </label>

        <input
          type="text"
          name="rollNo"
          value={fee.rollNo}
          onChange={handleChange}
          placeholder="Student roll number (optional)"
        />

      </div>

      {/* ==================================
          TOTAL FEE
      ================================== */}

      <div className="form-group">

        <label>
          Total Fee *
        </label>

        <input
          type="number"
          name="totalFee"
          value={fee.totalFee}
          onChange={handleChange}
          placeholder="Enter total fee"
          min="0"
          required
        />

      </div>

      {/* ==================================
          PAID AMOUNT
      ================================== */}

      <div className="form-group">

        <label>
          Paid Amount *
        </label>

        <input
          type="number"
          name="paidAmount"
          value={fee.paidAmount}
          onChange={handleChange}
          placeholder="Enter paid amount"
          min="0"
          required
        />

      </div>

      {/* ==================================
          PAYMENT DATE
      ================================== */}

      <div className="form-group">

        <label>
          Payment Date
        </label>

        <input
          type="date"
          name="paymentDate"
          value={fee.paymentDate}
          onChange={handleChange}
        />

      </div>

      {/* ==================================
          PAYMENT MODE
      ================================== */}

      <div className="form-group">

        <label>
          Payment Mode
        </label>

        <select
          name="paymentMode"
          value={fee.paymentMode}
          onChange={handleChange}
        >
          <option value="Cash">
            Cash
          </option>

          <option value="Online">
            Online
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Cheque">
            Cheque
          </option>
        </select>

      </div>

      {/* ==================================
          BUTTONS
      ================================== */}

      <div className="form-buttons">

        <button
          type="submit"
          className="save-btn"
        >
          {feeData
            ? "Update Fee"
            : "Save Fee"}
        </button>

      </div>

    </form>
  );
}