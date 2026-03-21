import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  await connectDB();

  const room = await Room.findById(params.id);

  const tenant = await Tenant.findOne({
    roomNumber: room.roomNumber,
  });

  let payments = [];

  if (tenant) {
    // 🔥 AUTO MONTH GENERATION
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
          totalRent: tenant.rentAmount,
          paidAmount: 0,
          remainingAmount: tenant.rentAmount,
          status: "unpaid",
        });
      }

      current.setMonth(current.getMonth() + 1);
    }

    payments = await Payment.find({
      tenant: tenant._id,
    });
  }

  const totalPending = payments.reduce(
    (a, x) => a + x.remainingAmount,
    0
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">

      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        🏠 Room {room.roomNumber}
      </h1>

      <div className="bg-gray-800 p-4 rounded-xl mb-4">
        <p>Status: 
          <span className={`ml-2 ${
            room.status === "occupied"
              ? "text-red-400"
              : "text-green-400"
          }`}>
            {room.status}
          </span>
        </p>
        <p>Rent: ₹{room.rent}</p>
      </div>

      {tenant && (
        <div className="bg-gray-800 p-4 rounded-xl mb-4">
          <p>👤 {tenant.name}</p>
          <p>📞 {tenant.phone}</p>
          <p>📅 {new Date(tenant.startDate).toDateString()}</p>
        </div>
      )}

      <div className="bg-black p-4 rounded-xl">
        <h2 className="text-yellow-400 font-bold mb-2">
          Payments
        </h2>

        {payments.map((p) => (
          <div key={p._id} className="border-b py-2">
            <p>{p.month}</p>
            <p>Paid: ₹{p.paidAmount}</p>
            <p>Remaining: ₹{p.remainingAmount}</p>
            <p>{p.status}</p>
          </div>
        ))}

        <h3 className="text-red-400 mt-3">
          Total Pending: ₹{totalPending}
        </h3>
      </div>
    </div>
  );
}
