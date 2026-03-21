import Navbar from "@/components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();

  const rooms = await Room.find();
  const tenants = await Tenant.find();
  const payments = await Payment.find();

  const tenantMap = {};
  tenants.forEach((t) => {
    tenantMap[t.roomNumber] = t;
  });

  // STATS
  const totalIncome = payments.reduce(
    (a, p) => a + (p.paidAmount || 0),
    0
  );

  const totalPending = payments.reduce(
    (a, p) => a + (p.remainingAmount || 0),
    0
  );

  const occupiedRooms = rooms.filter(
    (r) => r.status === "occupied"
  ).length;

  // CURRENT MONTH
  const now = new Date();
  const currentMonth = now.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const currentPayments = payments.filter(
    (p) => p.month === currentMonth
  );

  const currentPaid = currentPayments.reduce(
    (a, p) => a + (p.paidAmount || 0),
    0
  );

  const currentPending = currentPayments.reduce(
    (a, p) => a + (p.remainingAmount || 0),
    0
  );

  // GROUP
  const floors = {};
  rooms.forEach((room) => {
    const floor = room.roomNumber.split("-")[0];
    if (!floors[floor]) floors[floor] = [];
    floors[floor].push(room);
  });

  return (
    <div>
      <Navbar />

      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400 drop-shadow-lg">
          🏢 Smart Rent Dashboard
        </h1>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-green-500/20 border border-green-400 p-4 rounded-xl shadow hover:scale-105 transition">
            <p className="text-green-300">Total Income</p>
            <h2 className="text-2xl font-bold text-green-400">
              ₹{totalIncome}
            </h2>
          </div>

          <div className="bg-red-500/20 border border-red-400 p-4 rounded-xl shadow hover:scale-105 transition">
            <p className="text-red-300">Pending</p>
            <h2 className="text-2xl font-bold text-red-400">
              ₹{totalPending}
            </h2>
          </div>

          <div className="bg-blue-500/20 border border-blue-400 p-4 rounded-xl shadow hover:scale-105 transition">
            <p className="text-blue-300">Occupied</p>
            <h2 className="text-2xl font-bold text-blue-400">
              {occupiedRooms}
            </h2>
          </div>

        </div>

        {/* 🔥 CURRENT MONTH */}
        <div className="bg-gray-800 p-4 rounded-xl shadow mb-6 border border-purple-500">

          <h2 className="text-lg font-bold mb-3 text-purple-400">
            📅 {currentMonth}
          </h2>

          <div className="flex gap-6">

            <div className="bg-green-900/40 p-3 rounded-lg">
              <p>Paid</p>
              <h3 className="text-green-400 text-xl font-bold">
                ₹{currentPaid}
              </h3>
            </div>

            <div className="bg-red-900/40 p-3 rounded-lg">
              <p>Pending</p>
              <h3 className="text-red-400 text-xl font-bold">
                ₹{currentPending}
              </h3>
            </div>

          </div>

        </div>

        {/* ROOMS */}
        {Object.keys(floors).map((floor) => (
          <div key={floor} className="mb-8">

            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              {floor} Floor
            </h2>

            <div className="flex flex-wrap gap-4">

              {floors[floor].map((room) => {
                const tenant = tenantMap[room.roomNumber];

                return (
                  <a
                    key={room._id}
                    href={`/room/${room._id}`}
                    className={`w-32 h-32 p-3 rounded-xl flex flex-col justify-between transition transform hover:scale-110 shadow-lg ${
                      room.status === "occupied"
                        ? "bg-gradient-to-br from-red-600 to-red-800"
                        : "bg-gradient-to-br from-green-400 to-green-600 text-black"
                    }`}
                  >
                    <h3 className="text-center font-bold">
                      {room.roomNumber}
                    </h3>

                    <p className="text-xs text-center">
                      {room.status}
                    </p>

                    {tenant && (
                      <p className="text-xs text-center font-bold text-yellow-300">
                        {tenant.name}
                      </p>
                    )}

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
