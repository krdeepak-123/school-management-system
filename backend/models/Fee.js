const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
{
feeId: {
type: String,
unique: true,
},


studentName: {
  type: String,
  required: true,
  trim: true,
},

className: {
  type: String,
  required: true,
  trim: true,
},

section: {
  type: String,
  required: true,
  trim: true,
},

totalFee: {
  type: Number,
  required: true,
  default: 0,
},

paidAmount: {
  type: Number,
  required: true,
  default: 0,
},

dueAmount: {
  type: Number,
  default: 0,
},

paymentDate: {
  type: Date,
  required: true,
},

paymentMode: {
  type: String,
  enum: ["Cash", "Online", "UPI", "Cheque"],
  default: "Cash",
},

status: {
  type: String,
  enum: ["Paid", "Partial", "Due"],
  default: "Due",
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model("Fee", feeSchema);
