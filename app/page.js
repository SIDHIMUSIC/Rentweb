import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();
  const rooms = await Room.find();

  // group by floor
  const floors = {};

  rooms.forEach((room) => {
    const floor = room.roomNumber.split("-")[0]; // F1, F2
    if (!floors[floor]) floors[floor] = [];
    floors[floor].push(room);
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        🏢 Rent Dashboard
      </h1>

      {Object.keys(floors).map((floor) => (
        <div key={floor} className="mb-8">
          
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            {floor} Floor
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {floors[floor].map((room) => (
              <div
                key={room._id}
                className={`p-4 rounded-xl shadow-md transition hover:scale-105 ${
                  room.status === "occupied"
                    ? "bg-red-500 text-white"
                    : "bg-green-100 text-gray-800"
                }`}
              >
                <h3 className="text-lg font-bold">
                  {room.roomNumber}
                </h3>

                <span
                  className={`text-sm font-semibold ${
                    room.status === "occupied"
                      ? "text-white"
                      : "text-green-700"
                  }`}
                >
                  ● {room.status}
                </span>

                {room.tenantName && (
                  <p className="mt-2 text-sm">
                    👤 {room.tenantName}
                  </p>
                )}

                <p className="text-sm mt-1">₹{room.rent}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
