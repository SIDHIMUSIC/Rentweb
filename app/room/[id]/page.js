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

  const payments = await Payment.find({
    tenant: tenant?._id,
  });

  const totalPending = payments.reduce(
    (a, x) => a + x.remainingAmount,
    0
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">

      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        🏠 Room {room.roomNumber}
      </h1>

      {/* ROOM INFO */}
      <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
        <p>Status:
          <span className={`ml-2 font-bold ${
            room.status === "occupied"
              ? "text-red-400"
              : "text-green-400"
          }`}>
            {room.status}
          </span>
        </p>

        <p className="text-yellow-400 font-bold">
          Rent: ₹{room.rent}
        </p>
      </div>

      {/* TENANT */}
      {tenant && (
        <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
          <h2 className="text-lg text-green-400 font-bold">
            👤 Tenant
          </h2>

          <p>Name: {tenant.name}</p>
          <p>Phone: {tenant.phone}</p>
          <p className="text-blue-400">
            Start: {new Date(tenant.startDate).toDateString()}
          </p>
        </div>
      )}

      {/* PAYMENTS */}
      <div className="bg-black p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold text-yellow-400 mb-3">
          💰 Payments
        </h2>

        {payments.map((p) => (
          <div key={p._id} className="border-b border-gray-700 py-2">
            <p className="text-blue-400 font-semibold">
              {p.month.toUpperCase()}
            </p>

            <p>Paid: ₹{p.paidAmount}</p>

            <p className="text-red-400">
              Remaining: ₹{p.remainingAmount}
            </p>

            <p className={`font-bold ${
              p.status === "paid"
                ? "text-green-400"
                : p.status === "partial"
                ? "text-yellow-400"
                : "text-red-500"
            }`}>
              {p.status}
            </p>
          </div>
        ))}

        <h3 className="mt-4 text-red-400 font-bold text-xl">
          Total Pending: ₹{totalPending}
        </h3>
      </div>
    </div>
  );
}
