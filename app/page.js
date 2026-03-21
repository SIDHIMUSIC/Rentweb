import Navbar from "@/components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();
  const rooms = await Room.find();

  // group by floor
  const floors = {};

  rooms.forEach((room) => {
    const floor = room.roomNumber.split("-")[0]; // F1
    if (!floors[floor]) floors[floor] = [];
    floors[floor].push(room);
  });

  return (
    <div>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">🏢 Dashboard</h1>

        {Object.keys(floors).map((floor) => (
          <div key={floor} className="mb-8">

            {/* FLOOR TITLE */}
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              {floor} Floor
            </h2>

            {/* ROOMS ROW GRID */}
            <div className="flex flex-wrap gap-4">
              {floors[floor].map((room) => (
                <div
                  key={room._id}
                  className={`w-32 h-32 p-3 rounded-xl shadow-md flex flex-col justify-between ${
                    room.status === "occupied"
                      ? "bg-red-500 text-white"
                      : "bg-green-200 text-black"
                  }`}
                >
                  {/* ROOM NUMBER */}
                  <h3 className="font-bold text-center">
                    {room.roomNumber}
                  </h3>

                  {/* STATUS */}
                  <p className="text-xs text-center">
                    {room.status}
                  </p>

                  {/* TENANT */}
                  {room.tenantName && (
                    <p className="text-xs text-center">
                      👤 {room.tenantName}
                    </p>
                  )}

                  {/* RENT */}
                  <p className="text-xs text-center">
                    ₹{room.rent}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
