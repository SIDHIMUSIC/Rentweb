
import Navbar from "@/components/Navbar";
import TenantForm from "@/components/TenantForm";

export default async function Page(){
  const tenants=await fetch("http://localhost:3000/api/tenants").then(r=>r.json());

  return(
    <div>
      <Navbar/>
      <div className="p-4">
        <TenantForm/>
        <ul className="mt-4">
          {tenants.map(t=><li key={t._id}>{t.name} - {t.roomNumber}</li>)}
        </ul>
      </div>
    </div>
  )
}
