import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../models/Tenant";
import Room from "../../../../models/Room";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const tenant = await Tenant.findById(params.id);

    if (!tenant) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ ROOM VACANT
    await Room.findOneAndUpdate(
      { roomNumber: tenant.roomNumber },
      {
        status: "vacant",
        tenantName: ""
      }
    );

    await Tenant.findByIdAndDelete(params.id);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
