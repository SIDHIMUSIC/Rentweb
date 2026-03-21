import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../models/Tenant";
import Room from "../../../../models/Room";

// DELETE
export async function DELETE(req, { params }) {
  await connectDB();

  const tenant = await Tenant.findById(params.id);

  if (tenant) {
    await Room.findOneAndUpdate(
      { roomNumber: tenant.roomNumber },
      {
        status: "vacant",
        tenantName: "",
      }
    );
  }

  await Tenant.findByIdAndDelete(params.id);

  return Response.json({ success: true });
}

// UPDATE (🔥 FULL EDIT SUPPORT)
export async function PUT(req, { params }) {
  await connectDB();

  const body = await req.json();

  await Tenant.findByIdAndUpdate(params.id, body);

  return Response.json({ success: true });
}
