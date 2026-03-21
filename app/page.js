"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");

    if (!admin) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  // ⛔ WAIT UNTIL CHECK
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <Dashboard />
  );
}
