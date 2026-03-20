import Navbar from "@/components/Navbar";
import PaymentForm from "@/components/PaymentForm";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export default async function Page() {
  await connectDB();
  const payments = await Payment.find().populate("tenant");

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <PaymentForm />

        <ul className="mt-4">
          {payments.map(p => (
            <li key={p._id}>
              {p.month} - ₹{p.paidAmount} ({p.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
