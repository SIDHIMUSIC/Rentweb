import { connectDB } from "../../../lib/mongodb";
import Room from "../../../models/Room";

export async function PUT(req) {
  await connectDB();

  const body = await req.json();

  const updated = await Room.findByIdAndUpdate(
    body.id,
    body,
    { new: true }
  );

  return Response.json(updated);
}
