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

  // 🔥 AUTO MONTH GENERATION (MAIN FIX)
  if (tenant) {
    const start = new Date(tenant.startDate);
    const now = new Date();

    let current = new Date(start);

    while (current <= now) {
      // 🔥 SAME FORMAT (VERY IMPORTANT)
      const month = current.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      // 🔥 CHECK EXIST
      const exists = await Payment.findOne({
        tenant: tenant._id,
        month: month,
      });

      // 🔥 ONLY CREATE IF NOT EXISTS
      if (!exists) {
        await Payment.create({
          tenant: tenant._id,
          month: month,
          totalRent: tenant.rentAmount || 3000,
          paidAmount: 0,
          remainingAmount: tenant.rentAmount || 3000,
          status: "unpaid",
        });
      }

      current.setMonth(current.getMonth() + 1);
    }
  }

  // 🔥 FETCH PAYMENTS AFTER GENERATION
  const payments = tenant
    ? await Payment.find({ tenant: tenant._id }).sort({
        createdAt: 1,
      })
    : [];

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

        <div className="bg-white p-4 rounded shadow mb-4">
          <p>Status: {room.status}</p>
          <p>Rent: ₹{room.rent}</p>
        </div>

        {/* TENANT DETAILS */}
        {tenant && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="font-bold text-blue-600">
              👤 {tenant.name}
            </p>
            <p>📞 {tenant.phone}</p>
            <p>
              📅{" "}
              {new Date(tenant.startDate).toDateString()}
            </p>
          </div>
        )}

        {/* PAYMENTS */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="text-lg mb-3 text-yellow-400">
            Payments
          </h2>

          {payments.map((p) => (
            <div key={p._id} className="border-b py-2">
              <p className="font-bold">{p.month}</p>
              <p>Paid: ₹{p.paidAmount}</p>
              <p>Remaining: ₹{p.remainingAmount}</p>
              <p>{p.status}</p>
            </div>
          ))}

          <p className="text-red-400 mt-3 font-bold">
            Total Pending: ₹{totalPending}
          </p>
        </div>

      </div>
    </div>
  );
}
