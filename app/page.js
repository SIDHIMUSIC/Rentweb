import Navbar from "@/components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();

  const rooms = await Room.find();
  const tenants = await Tenant.find();

  // 🔥 CREATE TENANT MAP (IMPORTANT)
  const tenantMap = {};
  tenants.forEach((t) => {
    tenantMap[t.roomNumber] = t;
  });

  // GROUP BY FLOOR
  const floors = {};
  rooms.forEach((room) => {
    const floor = room.roomNumber.split("-")[0];
    if (!floors[floor]) floors[floor] = [];
    floors[floor].push(room);
  });

  return (
    <div>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-6">
          🏢 Dashboard
        </h1>

        {Object.keys(floors).map((floor) => (
          <div key={floor} className="mb-8">

            <h2 className="text-lg font-semibold mb-3 text-blue-600">
              {floor} Floor
            </h2>

            <div className="flex flex-wrap gap-4">

              {floors[floor].map((room) => {
                const tenant = tenantMap[room.roomNumber];

                return (
                  <a
                    key={room._id}
                    href={`/room/${room._id}`}
                    className={`w-32 h-32 p-3 rounded-xl shadow-md flex flex-col justify-between transition hover:scale-105 ${
                      room.status === "occupied"
                        ? "bg-red-500 text-white"
                        : "bg-green-200"
                    }`}
                  >
                    <h3 className="text-center font-bold">
                      {room.roomNumber}
                    </h3>

                    <p className="text-xs text-center">
                      {room.status}
                    </p>

                    {/* 👤 TENANT NAME */}
                    {tenant && (
                      <p className="text-xs text-center font-bold text-yellow-300">
                        {tenant.name}
                      </p>
                    )}

                    {/* 💰 RENT FIX (IMPORTANT) */}
                    <p className="text-xs text-center font-bold">
                      ₹{tenant ? tenant.rentAmount : room.rent}
                    </p>
                  </a>
                );
              })}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
