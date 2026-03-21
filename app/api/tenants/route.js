import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

// ✅ GET
export async function GET() {
  try {
    await connectDB();
    const tenants = await Tenant.find();
    return Response.json(tenants || []);
  } catch (err) {
    console.log("GET ERROR:", err);
    return Response.json([]); // ❌ crash नहीं
  }
}

// ✅ POST (ADD TENANT)
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

    return Response.json({ success: true });
  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ success: false });
  }
}
