import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../models/Tenant";
import Room from "../../../../models/Room";

export async function DELETE(req, { params }) {
  await connectDB();

  const tenant = await Tenant.findById(params.id);

  // room vacant again
  await Room.findOneAndUpdate(
    { roomNumber: tenant.roomNumber },
    {
      status: "vacant",
      tenantName: ""
    }
  );

  await Tenant.findByIdAndDelete(params.id);

  return Response.json({ message: "Deleted" });
}
