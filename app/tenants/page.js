import Navbar from "@/components/Navbar";
import TenantForm from "@/components/TenantForm";
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
        <h1 className="text-2xl font-bold mb-4">👥 Tenants</h1>

        <TenantForm />

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {tenants.map((t) => (
            <div key={t._id} className="bg-white p-3 rounded shadow">
              <p className="font-semibold">{t.name}</p>
              <p>{t.phone}</p>
              <p className="text-sm text-gray-500">
                {t.roomNumber}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
