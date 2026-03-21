import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const tenant = await Tenant.create(body);

  // 🔥 ROOM AUTO UPDATE
  await Room.findOneAndUpdate(
    { roomNumber: body.roomNumber },
    {
      status: "occupied",
      tenantName: body.name
    }
  );

  return Response.json(tenant);
}
