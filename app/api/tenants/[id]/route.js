export async function PUT(req, { params }) {
  await connectDB();

  const body = await req.json();

  const oldTenant = await Tenant.findById(params.id);

  if (!oldTenant) {
    return Response.json({ success: false });
  }

  // 🔥 अगर room change हुआ
  if (oldTenant.roomNumber !== body.roomNumber) {

    // ❌ CHECK: new room already occupied?
    const newRoom = await Room.findOne({
      roomNumber: body.roomNumber,
    });

    if (newRoom?.status === "occupied") {
      return Response.json({
        success: false,
        message: "Room already occupied ❌",
      });
    }

    // 🔥 OLD ROOM → VACANT
    await Room.findOneAndUpdate(
      { roomNumber: oldTenant.roomNumber },
      {
        status: "vacant",
        tenantName: "",
      }
    );

    // 🔥 NEW ROOM → OCCUPIED
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      {
        status: "occupied",
        tenantName: body.name,
      }
    );
  }

  // ✅ UPDATE TENANT
  await Tenant.findByIdAndUpdate(params.id, body);

  return Response.json({ success: true });
}
