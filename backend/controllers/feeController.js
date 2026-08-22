const Fee = require("../models/Fee");

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
console.log("🔥 CREATE FEE API HIT");
console.log("🔥 FEE BODY =", req.body);


const {
  studentName,
  className,
  section,
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

let status = "Pending";

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
const {
studentName,
className,
section,
totalFee,
paidAmount,
paymentDate,
paymentMode,
} = req.body;


const total = Number(totalFee);
const paid = Number(paidAmount);

if (paid > total) {
  return res.status(400).json({
    success: false,
    message: "Paid Amount cannot be greater than Total Fee",
  });
}

const dueAmount = total - paid;

let status = "Pending";

if (paid === total) {
  status = "Paid";
} else if (paid > 0) {
  status = "Partial";
}

const fee = await Fee.findByIdAndUpdate(
  req.params.id,
  {
    studentName,
    className,
    section,
    totalFee: total,
    paidAmount: paid,
    dueAmount,
    paymentDate,
    paymentMode,
    status,
  },
  {
    new: true,
    runValidators: true,
  }
);

if (!fee) {
  return res.status(404).json({
    success: false,
    message: "Fee Not Found",
  });
}

res.status(200).json({
  success: true,
  message: "Fee Updated Successfully",
  data: fee,
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
