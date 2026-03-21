import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  await connectDB();

  const room = await Room.findById(params.id);

  const tenant = await Tenant.findOne({
    roomNumber: room.roomNumber,
  });

  // 🔥 AUTO MONTH GENERATION
  if (tenant && tenant.rentAmount) {
    const start = new Date(tenant.startDate);
    const now = new Date();

    let current = new Date(start);

    while (current <= now) {
      const month = current.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const exists = await Payment.findOne({
        tenant: tenant._id,
        month,
      });

      if (!exists) {
        await Payment.create({
          tenant: tenant._id,
          month,
          totalRent: tenant.rentAmount, // ✅ FIX
          paidAmount: 0,
          remainingAmount: tenant.rentAmount, // ✅ FIX
          status: "unpaid",
        });
      }

      current.setMonth(current.getMonth() + 1);
    }
  }

  // 🔥 FETCH PAYMENTS
  let payments = tenant
    ? await Payment.find({ tenant: tenant._id })
    : [];

  // 🔥 SORT
  payments = payments.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // 🔥 TOTAL PENDING
  const totalPending = payments.reduce(
    (a, x) => a + (x.remainingAmount || 0),
    0
  );

  return (
    <div>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">

        <h1 className="text-2xl font-bold mb-4">
          🏠 Room {room.roomNumber}
        </h1>

        {/* ROOM INFO */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <p>
            Status:{" "}
            <span className="font-bold">
              {room.status}
            </span>
          </p>

          {/* ✅ RENT FIX */}
          <p className="text-green-600 font-bold">
            Rent: ₹{tenant ? tenant.rentAmount : room.rent}
          </p>
        </div>

        {/* TENANT */}
        {tenant && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="font-bold text-blue-600">
              👤 {tenant.name}
            </p>
            <p>📞 {tenant.phone}</p>
            <p>
              📅 {new Date(tenant.startDate).toDateString()}
            </p>

            <p className="text-purple-600 font-bold">
              💰 Rent: ₹{tenant.rentAmount}
            </p>
          </div>
        )}

        {/* PAYMENTS */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="text-yellow-400 mb-3 text-lg">
            💳 Payments
          </h2>

          {payments.map((p) => (
            <div key={p._id} className="border-b py-2">
              <p className="font-bold">{p.month}</p>

              <p>Paid: ₹{p.paidAmount}</p>

              <p className="text-red-400">
                Remaining: ₹{p.remainingAmount}
              </p>

              <p
                className={
                  p.status === "paid"
                    ? "text-green-400"
                    : p.status === "partial"
                    ? "text-yellow-400"
                    : "text-red-500"
                }
              >
                {p.status}
              </p>
            </div>
          ))}

          <p className="text-red-400 mt-3 font-bold text-lg">
            Total Pending: ₹{totalPending}
          </p>
        </div>

      </div>
    </div>
  );
}
