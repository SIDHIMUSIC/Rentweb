import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const tenant = await Tenant.create(body);

    // ✅ ROOM UPDATE FIX
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      {
        status: "occupied",
        tenantName: body.name
      },
      { new: true }
    );

    return Response.json({ success: true, tenant });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
