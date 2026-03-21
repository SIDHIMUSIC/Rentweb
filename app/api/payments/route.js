import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";

export async function GET() {
  try {
    await connectDB();
    const data = await Payment.find().populate("tenant");
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const totalRent = 3000;
    const remaining = totalRent - body.paidAmount;

    let status = "unpaid";
    if (body.paidAmount === 0) status = "unpaid";
    else if (remaining === 0) status = "paid";
    else status = "partial";

    await Payment.create({
      tenant: body.tenant,
      month: body.month,
      totalRent,
      paidAmount: body.paidAmount,
      remainingAmount: remaining,
      status,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.log(err);
    return Response.json({ success: false });
  }
}
