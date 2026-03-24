import crypto from "crypto";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    await connectDB();

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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      amount,
      paymentMode,
    } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const payment = await Payment.findById(paymentId).populate("tenant");

      if (!payment) {
        return Response.json({
          success: false,
          message: "Payment not found",
        });
      }

      let remaining = amount;

      const payments = await Payment.find({
        tenant: payment.tenant._id,
      }).sort({ createdAt: 1 });

      for (let p of payments) {
        if (remaining <= 0) break;

        if (p.remainingAmount > 0) {
          if (remaining >= p.remainingAmount) {
            remaining -= p.remainingAmount;
            p.paidAmount = p.totalRent;
            p.remainingAmount = 0;
            p.status = "paid";
          } else {
            p.paidAmount += remaining;
            p.remainingAmount -= remaining;
            p.status = "partial";
            remaining = 0;
          }

          await p.save();
        }
      }

      const { data: transaction } = await supabase
        .from("transactions")
        .insert({
          payment_id: paymentId,
          tenant_name: payment.tenant.name,
          room_number: payment.tenant.roomNumber,
          amount: amount,
          payment_mode: paymentMode,
          transaction_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: "success",
        })
        .select()
        .single();

      return Response.json({
        success: true,
        transactionId: razorpay_payment_id,
        transaction: transaction,
      });
    } else {
      await supabase.from("transactions").insert({
        payment_id: paymentId,
        tenant_name: "Unknown",
        room_number: "Unknown",
        amount: amount,
        payment_mode: paymentMode,
        transaction_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        status: "failed",
      });

      return Response.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}
