import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";
import Payment from "../../../models/Payment"; // 🔥 ADD THIS

// ===============================
// GET
// ===============================
export async function GET() {
  try {
    await connectDB();

    const tenants = await Tenant.find();

    return Response.json(tenants || []);
  } catch (err) {
    console.log("GET ERROR:", err);
    return Response.json([]);
  }
}

// ===============================
// POST (ADD TENANT + AUTO RENT)
// ===============================
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const tenant = await Tenant.create(body);

    // 🔥 ROOM UPDATE
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      {
        status: "occupied",
        tenantName: body.name,
      }
    );

    // 🔥 AUTO GENERATE 12 MONTH PAYMENTS
    const monthsToGenerate = 12;

    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(tenant.startDate || new Date());

      date.setMonth(date.getMonth() + i);

      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      await Payment.create({
        tenant: tenant._id,
        month,
        totalRent: tenant.rentAmount,
        paidAmount: 0,
        remainingAmount: tenant.rentAmount,
        status: "unpaid",
      });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ success: false });
  }
}
