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
      <div className="p-4">
        <TenantForm />

        <ul className="mt-4">
          {tenants.map(t => (
            <li key={t._id}>{t.name} - {t.roomNumber}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
