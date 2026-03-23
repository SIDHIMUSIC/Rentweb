import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET() {
  await connectDB();

  const rooms = await Room.find({ status: "vacant" });

  return Response.json(rooms);
}
