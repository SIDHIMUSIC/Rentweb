import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";

export async function GET() {
  await connectDB();

  const rooms = await Room.find();
  const tenants = await Tenant.find();
  const payments = await Payment.find();

  return Response.json({
    rooms,
    tenants,
    payments,
  });
}
