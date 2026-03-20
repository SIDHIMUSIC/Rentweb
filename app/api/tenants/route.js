import { connectDB } from "../../../lib/mongodb";
import Tenant from "../../../models/Tenant";

export async function GET() {
  try {
    await connectDB();
    const tenants = await Tenant.find();
    return Response.json(tenants);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
