import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import Tenant from "@/models/Tenant";
import Payment from "@/models/Payment";

export default async function Page({ params }) {
  await connectDB();

  const room = await Room.findById(params.id);
  const tenant = await Tenant.findOne({ roomNumber: room.roomNumber });
  const payments = await Payment.find({ tenant: tenant?._id });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        🏠 Room {room.roomNumber}
      </h1>

      {/* ROOM INFO */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <p>Status: {room.status}</p>
        <p>Rent: ₹{room.rent}</p>
      </div>

      {/* TENANT INFO */}
      {tenant && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold">👤 Tenant</h2>
          <p>Name: {tenant.name}</p>
          <p>Phone: {tenant.phone}</p>
        </div>
      )}

      {/* PAYMENTS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">💰 Payments</h2>

        {payments.length === 0 && <p>No payments yet</p>}

        {payments.map((p) => (
          <div key={p._id} className="border-b py-2">
            {p.month} - ₹{p.paidAmount} ({p.status})
          </div>
        ))}
      </div>

    </div>
  );
}
