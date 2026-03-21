import Navbar from "@/components/Navbar";
import { connectDB } from "@/lib/mongodb";
import Tenant from "@/models/Tenant";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();

  const tenants = await Tenant.find();

  return (
    <div>
      <Navbar />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">💰 Payments</h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 flex-wrap">

          {/* TENANT SELECT */}
          <select className="border p-2 rounded">
            <option value="">Select Tenant</option>

            {tenants.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.roomNumber})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Month"
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Paid"
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Remaining"
            className="border p-2 rounded"
          />

          <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
            Add Payment
          </button>
        </div>

      </div>
    </div>
  );
}
