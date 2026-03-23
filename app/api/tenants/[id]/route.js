import { connectDB } from "../../../../lib/mongodb";
import Tenant from "../../../../models/Tenant";
import Room from "../../../../models/Room";
import jwt from "jsonwebtoken";

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

// PUT (🔥 FINAL WORKING EDIT)
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get("authorization");

    if (!token) {
      return Response.json({ success: false, message: "No token ❌" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json({ success: false, message: "Invalid token ❌" });
    }

    const body = await req.json();

    const oldTenant = await Tenant.findById(params.id);

    if (!oldTenant) {
      return Response.json({ success: false, message: "Not found ❌" });
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

      // OLD ROOM VACANT
      await Room.findOneAndUpdate(
        { roomNumber: oldTenant.roomNumber },
        {
          status: "vacant",
          tenantName: "",
        }
      );

      // NEW ROOM OCCUPIED
      await Room.findOneAndUpdate(
        { roomNumber: body.roomNumber },
        {
          status: "occupied",
          tenantName: body.name,
        }
      );
    }

    // UPDATE TENANT
    await Tenant.findByIdAndUpdate(params.id, body);

    return Response.json({ success: true });

  } catch (err) {
    console.log("PUT ERROR:", err);
    return Response.json({
      success: false,
      message: "Server error ❌",
    });
  }
}
