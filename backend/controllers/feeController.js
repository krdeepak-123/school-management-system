const Fee = require("../models/Fee");
const Student = require("../models/Student");

// ==========================================
// GENERATE FEE ID
// ==========================================
const generateFeeId = async () => {
const lastFee = await Fee.findOne().sort({
createdAt: -1,
});

if (!lastFee || !lastFee.feeId) {
return "FEE001";
}

const lastNumber = parseInt(
lastFee.feeId.replace("FEE", "")
);

const nextNumber = lastNumber + 1;

return `FEE${String(nextNumber).padStart(3, "0")}`;
};

// ==========================================
// CREATE FEE
// ==========================================
exports.createFee = async (req, res) => {
try {

const {
  studentName,
  className,
  section,
  rollNo,
  totalFee,
  paidAmount,
  paymentDate,
  paymentMode,
} = req.body;

if (
  !studentName ||
  !className ||
  !section ||
  totalFee === undefined ||
  paidAmount === undefined
) {
  return res.status(400).json({
    success: false,
    message: "Please fill all required fields",
  });
}

const total = Number(totalFee);
const paid = Number(paidAmount);

if (isNaN(total) || isNaN(paid)) {
  return res.status(400).json({
    success: false,
    message: "Total Fee and Paid Amount must be numbers",
  });
}

if (paid > total) {
  return res.status(400).json({
    success: false,
    message: "Paid Amount cannot be greater than Total Fee",
  });
}

const dueAmount = total - paid;

// "Due" is the model's enum value for unpaid fees
// (the previous "Pending" value failed validation)
let status = "Due";

if (paid === total) {
  status = "Paid";
} else if (paid > 0) {
  status = "Partial";
}

const feeId = await generateFeeId();

const fee = await Fee.create({
  feeId,
  studentName,
  className,
  section,
  rollNo: rollNo ?? "",
  totalFee: total,
  paidAmount: paid,
  dueAmount,
  paymentDate: paymentDate || new Date(),
  paymentMode: paymentMode || "Cash",
  status,
});

res.status(201).json({
  success: true,
  message: "Fee Added Successfully",
  data: fee,
});


} catch (error) {
console.error("CREATE FEE ERROR:", error);


res.status(400).json({
  success: false,
  message: error.message,
});


}
};

// ==========================================
// MY FEES (Students see only their own records)
// ==========================================
exports.getMyFees = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.linkedId);

      if (!student) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }

      // Match by class + section and rollNo (falling back to the student
      // name for fees recorded before the rollNo field existed).
      const or = [
        {
          studentName: new RegExp(
            `^${String(student.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        },
      ];

      if (student.rollNo) {
        // The rollNo may be stored as a number or a string —
        // match either representation.
        or.unshift({ rollNo: { $in: [student.rollNo, String(student.rollNo)] } });
      }

      const fees = await Fee.find({
        className: student.className,
        section: student.section,
        $or: or,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: fees.length,
        data: fees,
      });
    }

    const fees = await Fee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    console.error("GET MY FEES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// GET ALL FEES
// ==========================================
exports.getFees = async (req, res) => {
try {
const fees = await Fee.find().sort({
createdAt: -1,
});


res.status(200).json({
  success: true,
  count: fees.length,
  data: fees,
});


} catch (error) {
console.error("GET FEES ERROR:", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// ==========================================
// GET SINGLE FEE
// ==========================================
exports.getSingleFee = async (req, res) => {
try {
const fee = await Fee.findById(req.params.id);


if (!fee) {
  return res.status(404).json({
    success: false,
    message: "Fee Not Found",
  });
}

res.status(200).json({
  success: true,
  data: fee,
});


} catch (error) {
console.error("GET SINGLE FEE ERROR:", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// ==========================================
// UPDATE FEE
// ==========================================
exports.updateFee = async (req, res) => {
try {

const existing = await Fee.findById(req.params.id);

if (!existing) {
  return res.status(404).json({
    success: false,
    message: "Fee Not Found",
  });
}

const {
studentName,
className,
section,
rollNo,
totalFee,
paidAmount,
paymentDate,
paymentMode,
} = req.body;

const total = Number(
  totalFee !== undefined ? totalFee : existing.totalFee
);
const paid = Number(
  paidAmount !== undefined ? paidAmount : existing.paidAmount
);

if (isNaN(total) || isNaN(paid)) {
  return res.status(400).json({
    success: false,
    message: "Total Fee and Paid Amount must be numbers",
  });
}

if (paid > total) {
  return res.status(400).json({
    success: false,
    message: "Paid Amount cannot be greater than Total Fee",
  });
}

const dueAmount = total - paid;

let status = "Due";

if (paid === total) {
  status = "Paid";
} else if (paid > 0) {
  status = "Partial";
}

existing.studentName = studentName !== undefined ? studentName : existing.studentName;
existing.className = className !== undefined ? className : existing.className;
existing.section = section !== undefined ? section : existing.section;
existing.rollNo = rollNo !== undefined ? rollNo : existing.rollNo || "";
existing.totalFee = total;
existing.paidAmount = paid;
existing.dueAmount = dueAmount;
existing.paymentDate = paymentDate || existing.paymentDate;
existing.paymentMode = paymentMode !== undefined ? paymentMode : existing.paymentMode;
existing.status = status;

await existing.save();

res.status(200).json({
  success: true,
  message: "Fee Updated Successfully",
  data: existing,
});


} catch (error) {
console.error("UPDATE FEE ERROR:", error);


res.status(400).json({
  success: false,
  message: error.message,
});


}
};

// ==========================================
// DELETE FEE
// ==========================================
exports.deleteFee = async (req, res) => {
try {
const fee = await Fee.findByIdAndDelete(
req.params.id
);


if (!fee) {
  return res.status(404).json({
    success: false,
    message: "Fee Not Found",
  });
}

res.status(200).json({
  success: true,
  message: "Fee Deleted Successfully",
});


} catch (error) {
console.error("DELETE FEE ERROR:", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};
