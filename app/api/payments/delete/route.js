import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // 🔐 ADMIN CHECK (VERY IMPORTANT)
    if (!body.isAdmin) {
      return Response.json({
        success: false,
        message: "Unauthorized ❌",
      });
    }

    // 🔍 CHECK PAYMENT EXIST
    const payment = await Payment.findById(body.id);

    if (!payment) {
      return Response.json({
        success: false,
        message: "Payment not found ❌",
      });
    }

    // 🗑️ DELETE PAYMENT
    await Payment.findByIdAndDelete(body.id);

    return Response.json({
      success: true,
      message: "Deleted successfully ✅",
    });

  } catch (err) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
