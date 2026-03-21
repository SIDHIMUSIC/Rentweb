import { connectDB } from "../../../../lib/mongodb";
import Payment from "../../../../models/Payment";

export async function GET() {
  await connectDB();

  const payments = await Payment.find();

  const seen = {};

  for (let p of payments) {
    const key = p.tenant + "_" + p.month;

    if (seen[key]) {
      await Payment.findByIdAndDelete(p._id);
    } else {
      seen[key] = true;
    }
  }

  return Response.json({ message: "Duplicates removed ✅" });
}
