import { connectDB } from "../../../../lib/mongodb";
import Room from "../../../../models/Room";

export async function GET() {
  try {
    await connectDB();

    // 🔥 ONLY VACANT ROOMS
    const rooms = await Room.find({
      status: "vacant",
    }).lean();

    return Response.json(rooms);
  } catch (err) {
    console.log("ROOM ERROR:", err);
    return Response.json([]);
  }
}
