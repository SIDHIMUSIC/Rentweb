
import {connectDB} from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(){
  await connectDB();
  return Response.json(await Payment.find().populate("tenant"));
}

export async function POST(req){
  await connectDB();
  const b = await req.json();
  const status = b.remainingAmount===0?"paid":b.paidAmount>0?"partial":"unpaid";
  const p = await Payment.create({...b,status});
  return Response.json(p);
}
