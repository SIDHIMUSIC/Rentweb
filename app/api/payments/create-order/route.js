import Razorpay from "razorpay";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return Response.json({
        success: false,
        message: "No token",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json({
        success: false,
        message: "Invalid token",
      });
    }

    const body = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        paymentId: body.paymentId,
        tenantName: body.tenantName,
        roomNumber: body.roomNumber,
      },
    };

    const order = await razorpay.orders.create(options);

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);
    return Response.json({
      success: false,
      message: "Failed to create order",
    });
  }
}
