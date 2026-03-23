import { connectDB } from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Room from "@/models/Room";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  await connectDB();

  // 🔐 TOKEN CHECK
  const token = req.headers.get("authorization");

  if (!token) {
    return Response.json({
      success: false,
      message: "No token ❌",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return Response.json({
      success: false,
      message: "Invalid token ❌",
    });
  }

  const body = await req.json();

  const oldTenant = await Tenant.findById(params.id);

  if (!oldTenant) {
    return Response.json({ success: false });
  }

  // 🔥 ROOM CHANGE
  if (oldTenant.roomNumber !== body.roomNumber) {

    const newRoom = await Room.findOne({
      roomNumber: body.roomNumber,
    });

    if (newRoom?.status === "occupied") {
      return Response.json({
        success: false,
        message: "Room already occupied ❌",
      });
    }

    // OLD → vacant
    await Room.findOneAndUpdate(
      { roomNumber: oldTenant.roomNumber },
      { status: "vacant", tenantName: "" }
    );

    // NEW → occupied
    await Room.findOneAndUpdate(
      { roomNumber: body.roomNumber },
      { status: "occupied", tenantName: body.name }
    );
  }

  await Tenant.findByIdAndUpdate(params.id, body);

  return Response.json({
    success: true,
    message: "Updated ✅",
  });
}
