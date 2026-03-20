import Navbar from "@/components/Navbar";
import TenantForm from "@/components/TenantForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tenants = await fetch("/api/tenants", { cache: "no-store" }).then(res =>
    res.json()
  );

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <TenantForm />

        <ul className="mt-4 space-y-2">
          {tenants.map((t) => (
            <li key={t._id} className="bg-white p-2 rounded shadow">
              {t.name} - {t.roomNumber}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
