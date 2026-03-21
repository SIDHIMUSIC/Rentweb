"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function Page() {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      const r = await fetch("/api/rooms").then(res => res.json());
      const t = await fetch("/api/tenants").then(res => res.json());
      const p = await fetch("/api/payments").then(res => res.json());

      setRooms(Array.isArray(r) ? r : []);
      setTenants(Array.isArray(t) ? t : []);
      setPayments(Array.isArray(p) ? p : []);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-black text-white">
        Loading...
      </div>
    );
  }

  // ===============================
  // 🔥 MAP
  // ===============================
  const tenantMap = {};
  tenants.forEach((t) => {
    tenantMap[t.roomNumber] = t;
  });

  // ===============================
  // 🔥 STATS
  // ===============================
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

  // ===============================
  // 🔥 CURRENT MONTH
  // ===============================
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

  // ===============================
  // 🔥 GROUP FLOOR
  // ===============================
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
    <div>
      <Navbar />

      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          🏢 Dashboard
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-green-500/20 p-4 rounded">
            <p>Total Income</p>
            <h2>₹{totalIncome}</h2>
          </div>

          <div className="bg-red-500/20 p-4 rounded">
            <p>Pending</p>
            <h2>₹{totalPending}</h2>
          </div>

          <div className="bg-blue-500/20 p-4 rounded">
            <p>Occupied</p>
            <h2>{occupiedRooms}</h2>
          </div>

        </div>

        {/* CURRENT MONTH */}
        <div className="mb-6">
          📅 {currentMonth} → Paid ₹{currentPaid} | Pending ₹{currentPending}
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
                    className={`p-3 rounded w-28 text-center ${
                      room.status === "occupied"
                        ? "bg-red-500"
                        : "bg-green-500 text-black"
                    }`}
                  >
                    <p>{room.roomNumber}</p>
                    <p className="text-xs">{room.status}</p>

                    {tenant && (
                      <p className="text-xs font-bold">
                        {tenant.name}
                      </p>
                    )}

                    <p className="text-xs">
                      ₹{tenant ? tenant.rentAmount : room.rent}
                    </p>
                  </div>
                );
              })}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
