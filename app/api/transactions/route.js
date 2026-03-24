export const dynamic = "force-dynamic";

import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return Response.json({
        success: false,
        message: "No token",
      });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json({
        success: false,
        message: "Invalid token",
      });
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({
        success: false,
        message: "Failed to fetch transactions",
      });
    }

    return Response.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log("GET TRANSACTIONS ERROR:", err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}
