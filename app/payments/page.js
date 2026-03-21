"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
  });

  // LOAD DATA
  const loadData = async () => {
    const t = await fetch("/api/tenants").then(r => r.json());
    const p = await fetch("/api/payments").then(r => r.json());

    setTenants(Array.isArray(t) ? t : []);
    setPayments(Array.isArray(p) ? p : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // SAVE PAYMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Payment Saved ✅");
      loadData();
    } else {
      alert("Error ❌");
    }
  };

  // TOTAL PENDING
  const totalPending = payments.reduce(
    (a, x) => a + (x.remainingAmount || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        💳 Payments
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 flex-wrap mb-6 bg-white p-4 rounded shadow"
      >
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, tenant: e.target.value })
          }
        >
          <option>Select Tenant</option>
          {tenants.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.roomNumber})
            </option>
          ))}
        </select>

        <input
          placeholder="Month"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, month: e.target.value })
          }
        />

        <input
          placeholder="Paid Amount"
          type="number"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              paidAmount: Number(e.target.value),
            })
          }
        />

        <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
          Save
        </button>
      </form>

      {/* TOTAL PENDING */}
      <div className="bg-red-100 p-4 rounded mb-4">
        <h2 className="font-bold text-red-600">
          Total Pending: ₹{totalPending}
        </h2>
      </div>

      {/* HISTORY */}
      <div className="grid gap-3">
        {payments.map((p) => (
          <div
            key={p._id}
            className={`p-4 rounded shadow text-white ${
              p.status === "paid"
                ? "bg-green-500"
                : p.status === "partial"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            <p className="font-bold text-lg">
              {p.tenant?.name} ({p.month})
            </p>

            <p>Paid: ₹{p.paidAmount}</p>
            <p>Remaining: ₹{p.remainingAmount}</p>

            <p className="font-semibold">
              Status: {p.status}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
