import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const tenant = await Tenant.findById(body.tenant);

  const room = await Room.findOne({
    roomNumber: tenant.roomNumber,
  });

  const totalRent = room.rent;

  let existing = await Payment.findOne({
    tenant: body.tenant,
    month: body.month,
  });

  if (existing) {
    existing.paidAmount += body.paidAmount;
    existing.remainingAmount = totalRent - existing.paidAmount;

    existing.status =
      existing.remainingAmount === 0
        ? "paid"
        : "partial";

    await existing.save();

    return Response.json({ success: true });
  }

  const remaining = totalRent - body.paidAmount;

  await Payment.create({
    tenant: body.tenant,
    month: body.month,
    totalRent,
    paidAmount: body.paidAmount,
    remainingAmount: remaining,
    status:
      remaining === 0
        ? "paid"
        : body.paidAmount === 0
        ? "unpaid"
        : "partial",
  });

  return Response.json({ success: true });
}
