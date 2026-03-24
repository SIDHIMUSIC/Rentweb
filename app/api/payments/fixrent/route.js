export const dynamic = "force-dynamic";

import { connectDB } from "../../../../lib/mongodb";
import Payment from "../../../../models/Payment";
import Tenant from "../../../../models/Tenant";

export async function GET() {
  await connectDB();

  const payments = await Payment.find();

  for (let p of payments) {
    const tenant = await Tenant.findById(p.tenant);

    if (tenant) {
      const rent = tenant.rentAmount;

      if (p.paidAmount > rent) p.paidAmount = rent;

      p.totalRent = rent;
      p.remainingAmount = rent - p.paidAmount;

      p.status =
        p.remainingAmount === 0
          ? "paid"
          : p.paidAmount === 0
          ? "unpaid"
          : "partial";

      await p.save();
    }
  }

  return Response.json({ message: "Rent Updated ✅" });
}
