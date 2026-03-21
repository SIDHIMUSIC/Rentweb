"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
    remainingAmount: 0
  });

  useEffect(() => {
    fetch("/api/tenants").then(r => r.json()).then(setTenants);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    alert("Payment Saved ✅");
    location.reload();
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Payments</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">

        <select
          className="border p-2"
          onChange={(e) => setForm({ ...form, tenant: e.target.value })}
        >
          <option>Select Tenant</option>
          {tenants.map(t => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Month"
          className="border p-2"
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />

        <input
          placeholder="Paid"
          type="number"
          className="border p-2"
          onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
        />

        <input
          placeholder="Remaining"
          type="number"
          className="border p-2"
          onChange={(e) => setForm({ ...form, remainingAmount: Number(e.target.value) })}
        />

        <button className="bg-blue-500 text-white px-4">
          Save
        </button>

      </form>
    </div>
  );
}
