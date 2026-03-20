import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { connectDB } from "@/lib/mongodb";
import Tenant from "@/models/Tenant";
import Room from "@/models/Room";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();

  const t = await Tenant.find();
  const r = await Room.find();
  const p = await Payment.find();

  return {
    t: JSON.parse(JSON.stringify(t)),
    r: JSON.parse(JSON.stringify(r)),
    p: JSON.parse(JSON.stringify(p)),
  };
}

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
