import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  month: String,
  totalRent: { type: Number, default: 3000 },
  paidAmount: Number,
  remainingAmount: Number,
  status: String,
});

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
