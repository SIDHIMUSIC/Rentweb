import Navbar from "@/components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();
  const rooms = await Room.find();

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className={`p-4 rounded shadow text-white ${
                room.status === "occupied"
                  ? "bg-red-500"
                  : "bg-green-500"
              }`}
            >
              <h2 className="font-bold">{room.roomNumber}</h2>

              <p>{room.status}</p>

              {room.tenantName && (
                <p className="text-sm">{room.tenantName}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
