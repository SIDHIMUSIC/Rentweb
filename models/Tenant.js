
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name:String,
  phone:String,
  roomNumber:String,
  rentAmount:{type:Number,default:3000}
});
export default mongoose.models.Tenant || mongoose.model("Tenant",schema);
