import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Tenant from "../../../models/Tenant";

export async function GET() {
  await connectDB();

  const data = await Payment.find().populate("tenant");

  return Response.json(data);
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  // 🔐 ADMIN CHECK
  if (!body.isAdmin) {
    return Response.json({
      success: false,
      message: "Unauthorized ❌",
    });
  }

  const tenant = await Tenant.findById(body.tenant);

  if (!tenant) {
    return Response.json({ success: false });
  }

  // DATE VALIDATION
  const selectedDate = new Date(body.month);
  const startDate = new Date(tenant.startDate);

  if (selectedDate < startDate) {
    return Response.json({
      success: false,
      message: "Invalid month ❌",
    });
  }

  const totalRent = tenant.rentAmount;
  const month = body.month;

  let existing = await Payment.findOne({
    tenant: body.tenant,
    month,
  });

  // UPDATE
  if (existing) {
    let newPaid = existing.paidAmount + body.paidAmount;

    if (newPaid > totalRent) newPaid = totalRent;

    existing.paidAmount = newPaid;
    existing.remainingAmount = totalRent - newPaid;

    existing.status =
      existing.remainingAmount === 0
        ? "paid"
        : existing.paidAmount === 0
        ? "unpaid"
        : "partial";

    await existing.save();

    return Response.json({ success: true });
  }

  // CREATE
  let paid = body.paidAmount;
  if (paid > totalRent) paid = totalRent;

  const remaining = totalRent - paid;

  await Payment.create({
    tenant: body.tenant,
    month,
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
