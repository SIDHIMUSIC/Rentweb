import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const tenant = await Tenant.create(body);

    // ✅ update room with tenant
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      {
        status: "occupied",
        tenantName: body.name,
      }
    );

    return Response.json(tenant);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
