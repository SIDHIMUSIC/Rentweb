import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
  name: String,
  phone: String,
  roomNumber: String,
  rentAmount: Number,
  startDate: Date, // 🔥 NEW
});

export default mongoose.models.Tenant ||
  mongoose.model("Tenant", TenantSchema);
