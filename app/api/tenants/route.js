import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";
import Room from "../../../models/Room";
import Payment from "../../../models/Payment";
import jwt from "jsonwebtoken";

export async function GET() {
  await connectDB();
  const tenants = await Tenant.find();
  return Response.json(tenants || []);
}

export async function POST(req) {
  await connectDB();

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

  const tenant = await Tenant.create(body);

  await Room.findOneAndUpdate(
    { roomNumber: body.roomNumber },
    {
      status: "occupied",
      tenantName: body.name,
    }
  );

  return Response.json({ success: true });
}
