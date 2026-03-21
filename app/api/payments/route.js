import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

// GET
export async function GET() {
  await connectDB();

  const data = await Payment.find()
    .populate("tenant")
    .sort({ createdAt: 1 });

  return Response.json(data || []);
}

// POST
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const tenant = await Tenant.findById(body.tenant);

  const room = await Room.findOne({
    roomNumber: tenant.roomNumber,
  });

  const totalRent = tenant.rentAmount || room?.rent || 3000;

  // 🔥 FIX: SAME FORMAT MONTH
  const month = body.month; // must be SAME everywhere

  // 🔥 FIND EXISTING
  let existing = await Payment.findOne({
    tenant: body.tenant,
    month: month,
  });

  if (existing) {
    let newPaid = existing.paidAmount + body.paidAmount;

    if (newPaid > totalRent) newPaid = totalRent;

    existing.paidAmount = newPaid;
    existing.remainingAmount = totalRent - newPaid;

    existing.status =
      existing.remainingAmount === 0
        ? "paid"
        : "partial";

    await existing.save();

    return Response.json({ success: true });
  }

  // NEW
  let paid = body.paidAmount;
  if (paid > totalRent) paid = totalRent;

  const remaining = totalRent - paid;

  await Payment.create({
    tenant: body.tenant,
    month: month,
    totalRent,
    paidAmount: paid,
    remainingAmount: remaining,
    status:
      remaining === 0
        ? "paid"
        : paid === 0
        ? "unpaid"
        : "partial",
  });

  return Response.json({ success: true });
}
