import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const status =
    body.remainingAmount === 0
      ? "paid"
      : body.paidAmount > 0
      ? "partial"
      : "unpaid";

  const payment = await Payment.create({
    ...body,
    status
  });

  return Response.json(payment);
}
