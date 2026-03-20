
import mongoose from "mongoose";
const schema = new mongoose.Schema({
  roomNumber:String,
  status:{type:String,default:"vacant"}
});
export default mongoose.models.Room || mongoose.model("Room",schema);
