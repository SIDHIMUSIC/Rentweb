import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const payment = await Payment.findById(body.id);

  if (!payment) {
    return Response.json({
      success: false,
      message: "Payment not found",
    });
  }

  await Payment.findByIdAndDelete(body.id);

  return Response.json({
    success: true,
  });
}
