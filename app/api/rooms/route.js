import { connectDB } from "../../../lib/mongodb";
import Room from "../../../models/Room";

export async function GET() {
  await connectDB();
  return Response.json(await Room.find());
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const room = await Room.findByIdAndUpdate(
    body.id,
    body,
    { new: true }
  );

  return Response.json(room);
}
