import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  await Payment.findByIdAndDelete(body.id);

  return Response.json({ success: true });
}
