import Navbar from "@/components/Navbar";
import PaymentForm from "@/components/PaymentForm";

export const dynamic = "force-dynamic";

export default async function Page() {
  const payments = await fetch("/api/payments", { cache: "no-store" }).then(
    (res) => res.json()
  );

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <PaymentForm />

        <ul className="mt-4 space-y-2">
          {payments.map((p) => (
            <li key={p._id} className="bg-white p-2 rounded shadow">
              {p.month} - ₹{p.paidAmount} ({p.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
