import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";
import Payment from "../../../models/Payment";
import jwt from "jsonwebtoken"; // 🔐 ADD

// ===============================
// GET (optional open)
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
// POST (🔐 ADD TENANT + AUTO RENT)
// ===============================
export async function POST(req) {
  try {
    await connectDB();

    // 🔐 JWT CHECK
    const token = req.headers.get("authorization");

    if (!token) {
      return Response.json({
        success: false,
        message: "No token ❌",
      });
    }

    try {
      jwt.verify(token, "MY_SECRET_KEY");
    } catch {
      return Response.json({
        success: false,
        message: "Invalid token ❌",
      });
    }

    const body = await req.json();

    // ✅ CREATE TENANT
    const tenant = await Tenant.create(body);

    // 🔥 ROOM UPDATE
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      {
        status: "occupied",
        tenantName: body.name,
      }
    );

    // 🔥 AUTO GENERATE PAYMENTS
    const monthsToGenerate = 12;

    for (let i = 0; i < monthsToGenerate; i++) {
      const date = new Date(tenant.startDate || new Date());

      date.setMonth(date.getMonth() + i);

      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      // 🔁 DUPLICATE CHECK
      const exists = await Payment.findOne({
        tenant: tenant._id,
        month,
      });

      if (!exists) {
        await Payment.create({
          tenant: tenant._id,
          month,
          totalRent: tenant.rentAmount,
          paidAmount: 0,
          remainingAmount: tenant.rentAmount,
          status: "unpaid",
        });
      }
    }

    return Response.json({ success: true });

  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ success: false });
  }
}
