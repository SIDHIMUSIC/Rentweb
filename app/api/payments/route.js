import { connectDB } from "../../../lib/mongodb";
import Payment from "../../../models/Payment";
import Tenant from "../../../models/Tenant";

// ===============================
// GET ALL PAYMENTS
// ===============================
export async function GET() {
  await connectDB();

  const data = await Payment.find().populate("tenant");

  return Response.json(data);
}

// ===============================
// SAVE / UPDATE PAYMENT
// ===============================
export async function POST(req) {
  await connectDB();

  const body = await req.json();

  // ===============================
  // CHECK TENANT
  // ===============================
  const tenant = await Tenant.findById(body.tenant);

  if (!tenant) {
    return Response.json({
      success: false,
      message: "Tenant not found ❌",
    });
  }

  // ===============================
  // 🔥 DATE VALIDATION (FINAL FIX)
  // ===============================

  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3,
    May: 4, Jun: 5, Jul: 6, Aug: 7,
    Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  if (!body.month) {
    return Response.json({
      success: false,
      message: "Month required ❌",
    });
  }

  const parts = body.month.split(" ");

  if (parts.length !== 2) {
    return Response.json({
      success: false,
      message: "Invalid format ❌",
    });
  }

  const [mon, year] = parts;

  const selectedDate = new Date(Number(year), monthMap[mon]);
  const startDate = new Date(tenant.startDate);
  const today = new Date();

  // ❌ invalid date
  if (isNaN(selectedDate.getTime())) {
    return Response.json({
      success: false,
      message: "Invalid date ❌",
    });
  }

  // ❌ before tenant start
  if (selectedDate < startDate) {
    return Response.json({
      success: false,
      message: "Invalid month ❌",
    });
  }

  // ❌ FUTURE BLOCK (🔥 MAIN FIX)
  if (
    selectedDate.getFullYear() > today.getFullYear() ||
    (selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() > today.getMonth())
  ) {
    return Response.json({
      success: false,
      message: "Future month not allowed ❌",
    });
  }

  const totalRent = tenant.rentAmount;
  const month = body.month;

  // ===============================
  // CHECK EXISTING PAYMENT
  // ===============================
  let existing = await Payment.findOne({
    tenant: body.tenant,
    month,
  });

  // ===============================
  // UPDATE EXISTING
  // ===============================
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

  // ===============================
  // CREATE NEW PAYMENT
  // ===============================
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
