
import Navbar from "@/components/Navbar";
import PaymentForm from "@/components/PaymentForm";

export default async function Page(){
  const p=await fetch("http://localhost:3000/api/payments").then(r=>r.json());

  return(
    <div>
      <Navbar/>
      <div className="p-4">
        <PaymentForm/>
        <ul className="mt-4">
          {p.map(x=><li key={x._id}>{x.month} - ₹{x.paidAmount} ({x.status})</li>)}
        </ul>
      </div>
    </div>
  )
}
