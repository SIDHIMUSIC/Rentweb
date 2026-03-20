
import {connectDB} from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Room from "@/models/Room";

export async function GET(){
  await connectDB();
  return Response.json(await Tenant.find());
}

export async function POST(req){
  await connectDB();
  const body = await req.json();
  const t = await Tenant.create(body);
  await Room.findOneAndUpdate({roomNumber:body.roomNumber},{status:"occupied"});
  return Response.json(t);
}
