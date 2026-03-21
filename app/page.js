"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);

  // 🔐 LOGIN CHECK
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");

    if (!admin) {
      router.push("/login");
    } else {
      setIsAdmin(true);
      loadData();
    }
  }, []);

  // 📦 LOAD DATA (API से)
  const loadData = async () => {
    const r = await fetch("/api/rooms").then(res => res.json());
    const t = await fetch("/api/tenants").then(res => res.json());
    const p = await fetch("/api/payments").then(res => res.json());

    setRooms(r);
    setTenants(t);
    setPayments(p);
  };

  // ⛔ LOADING
  if (isAdmin === null) {
    return (
      <div className="h-screen flex justify-center items-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // ===============================
  // 🔥 DATA PROCESS
  // ===============================
  const tenantMap = {};
  tenants.forEach((t) => {
    tenantMap[t.roomNumber] = t;
  });

  const totalIncome = payments.reduce(
    (a, p) => a + (p.paidAmount || 0),
    0
  );

  const totalPending = payments.reduce(
    (a, p) => a + (p.remainingAmount || 0),
    0
  );

  const occupiedRooms = rooms.filter(
    (r) => r.status === "occupied"
  ).length;

  const now = new Date();
  const currentMonth = now.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });

  const currentPayments = payments.filter(
    (p) => p.month === currentMonth
  );

  const currentPaid = currentPayments.reduce(
    (a, p) => a + (p.paidAmount || 0),
    0
  );

  const currentPending = currentPayments.reduce(
    (a, p) => a + (p.remainingAmount || 0),
    0
  );

  const floors = {};
  rooms.forEach((room) => {
    const floor = room.roomNumber.split("-")[0];
    if (!floors[floor]) floors[floor] = [];
    floors[floor].push(room);
  });

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6 min-h-screen bg-black text-white">

      <h1 className="text-3xl text-center text-yellow-400 mb-6">
        🏢 Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/20 p-4 rounded">
          ₹{totalIncome}
        </div>
        <div className="bg-red-500/20 p-4 rounded">
          ₹{totalPending}
        </div>
        <div className="bg-blue-500/20 p-4 rounded">
          {occupiedRooms}
        </div>
      </div>

      {/* MONTH */}
      <div className="mb-6">
        {currentMonth} → ₹{currentPaid} / ₹{currentPending}
      </div>

      {/* ROOMS */}
      {Object.keys(floors).map((floor) => (
        <div key={floor} className="mb-6">

          <h2 className="text-blue-400">{floor} Floor</h2>

          <div className="flex flex-wrap gap-3">
            {floors[floor].map((room) => {
              const tenant = tenantMap[room.roomNumber];

              return (
                <div
                  key={room._id}
                  className={`p-3 rounded ${
                    room.status === "occupied"
                      ? "bg-red-500"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {room.roomNumber}
                  <br />
                  {tenant?.name}
                </div>
              );
            })}
          </div>

        </div>
      ))}

    </div>
  );
}
