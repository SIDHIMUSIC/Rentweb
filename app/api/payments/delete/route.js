import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  if (!body.isAdmin) {
    return Response.json({
      success: false,
      message: "Unauthorized ❌",
    });
  }

  const payment = await Payment.findById(body.id);

  if (!payment) {
    return Response.json({
      success: false,
    });
  }

  await Payment.findByIdAndDelete(body.id);

  return Response.json({ success: true });
}
