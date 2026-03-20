
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";

async function getData(){
  const t=await fetch("http://localhost:3000/api/tenants").then(r=>r.json());
  const r=await fetch("http://localhost:3000/api/rooms").then(r=>r.json());
  const p=await fetch("http://localhost:3000/api/payments").then(r=>r.json());
  return {t,r,p};
}

export default async function Page(){
  const {t,r,p}=await getData();
  const occ=r.filter(x=>x.status==="occupied").length;
  const col=p.reduce((a,x)=>a+x.paidAmount,0);
  const pen=p.reduce((a,x)=>a+x.remainingAmount,0);

  return(
    <div>
      <Navbar/>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Tenants" value={t.length}/>
        <Card title="Rooms" value={r.length}/>
        <Card title="Occupied" value={occ}/>
        <Card title="Collected" value={`₹${col}`}/>
        <Card title="Pending" value={`₹${pen}`}/>
      </div>
    </div>
  )
}
