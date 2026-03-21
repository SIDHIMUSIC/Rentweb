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

  // ===============================
  // 🔥 TENANT MAP
  // ===============================
  const tenantMap = {};
  tenants.forEach((t) => {
    tenantMap[t.roomNumber] = t;
  });

  // ===============================
  // 🔥 STATS
  // ===============================

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

  // ===============================
  // 🔥 CURRENT MONTH LOGIC (MAIN STEP 3)
  // ===============================

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

  // ===============================
  // 🔥 GROUP BY FLOOR
  // ===============================
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

        {/* ===============================
            🔥 STATS CARDS
        =============================== */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-green-500 text-white p-4 rounded shadow">
            <p>Total Income</p>
            <h2 className="text-xl font-bold">
              ₹{totalIncome}
            </h2>
          </div>

          <div className="bg-red-500 text-white p-4 rounded shadow">
            <p>Total Pending</p>
            <h2 className="text-xl font-bold">
              ₹{totalPending}
            </h2>
          </div>

          <div className="bg-blue-500 text-white p-4 rounded shadow">
            <p>Occupied Rooms</p>
            <h2 className="text-xl font-bold">
              {occupiedRooms}
            </h2>
          </div>

        </div>

        {/* ===============================
            🔥 CURRENT MONTH SUMMARY
        =============================== */}
        <div className="bg-white p-4 rounded shadow mb-6">

          <h2 className="text-lg font-bold mb-3 text-purple-600">
            📅 {currentMonth} Summary
          </h2>

          <div className="flex gap-6">

            <div className="bg-green-100 p-3 rounded">
              <p>Paid</p>
              <h3 className="text-green-600 font-bold text-lg">
                ₹{currentPaid}
              </h3>
            </div>

            <div className="bg-red-100 p-3 rounded">
              <p>Pending</p>
              <h3 className="text-red-600 font-bold text-lg">
                ₹{currentPending}
              </h3>
            </div>

          </div>

        </div>

        {/* ===============================
            ROOMS
        =============================== */}
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
