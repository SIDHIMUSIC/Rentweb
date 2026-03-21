import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

// GET
export async function GET() {
  await connectDB();

  const data = await Payment.find()
    .populate("tenant")
    .sort({ month: 1 }); // 🔥 SORT FIX

  return Response.json(data);
}

// POST
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const tenant = await Tenant.findById(body.tenant);
  const room = await Room.findOne({
    roomNumber: tenant.roomNumber,
  });

  const totalRent = tenant.rentAmount || room.rent;

  // 🔥 SAME MONTH CHECK
  let existing = await Payment.findOne({
    tenant: body.tenant,
    month: body.month,
  });

  if (existing) {
    // ✅ ADD TO EXISTING
    let newPaid = existing.paidAmount + body.paidAmount;

    // ❌ FIX: NEVER GO NEGATIVE
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

  // NEW ENTRY
  let paid = body.paidAmount;
  if (paid > totalRent) paid = totalRent;

  const remaining = totalRent - paid;

  await Payment.create({
    tenant: body.tenant,
    month: body.month,
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


