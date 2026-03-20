import Navbar from "@/components/Navbar";
import Card from "@/components/Card";

async function getData() {
  const t = await fetch("/api/tenants", { cache: "no-store" }).then(res => res.json());
  const r = await fetch("/api/rooms", { cache: "no-store" }).then(res => res.json());
  const p = await fetch("/api/payments", { cache: "no-store" }).then(res => res.json());

  return { t, r, p };
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const { t, r, p } = await getData();

  const occ = r.filter(x => x.status === "occupied").length;
  const col = p.reduce((a, x) => a + x.paidAmount, 0);
  const pen = p.reduce((a, x) => a + x.remainingAmount, 0);

  return (
    <div>
      <Navbar />
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Tenants" value={t.length} />
        <Card title="Rooms" value={r.length} />
        <Card title="Occupied" value={occ} />
        <Card title="Collected" value={`₹${col}`} />
        <Card title="Pending" value={`₹${pen}`} />
      </div>
    </div>
  );
}
