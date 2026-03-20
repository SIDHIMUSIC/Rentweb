
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  tenant:{type:mongoose.Schema.Types.ObjectId,ref:"Tenant"},
  month:String,
  totalRent:Number,
  paidAmount:Number,
  remainingAmount:Number,
  status:String,
  paymentMode:String
});
export default mongoose.models.Payment || mongoose.model("Payment",schema);
