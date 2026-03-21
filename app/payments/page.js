"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");

  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
  });

  const loadData = async () => {
    const t = await fetch("/api/tenants").then(r => r.json());
    const p = await fetch("/api/payments").then(r => r.json());

    setTenants(Array.isArray(t) ? t : []);
    setPayments(Array.isArray(p) ? p : []);
  };

  useEffect(() => {
    loadData();
  }, []);

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
      alert("Saved ✅");
      loadData();
    }
  };

  // 🔥 FILTER
  const filtered = payments.filter(
    (p) => p.tenant?._id === selectedTenant
  );

  // 🔥 SORT
  const sorted = filtered.sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPending = sorted.reduce(
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
          className="border p-2"
          value={selectedTenant}
          onChange={(e) => {
            setSelectedTenant(e.target.value);
            setForm({ ...form, tenant: e.target.value });
          }}
        >
          <option value="">Select Tenant</option>
          {tenants.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.roomNumber})
            </option>
          ))}
        </select>

        {/* 🔥 MONTH FIX */}
        <input
          type="month"
          className="border p-2"
          onChange={(e) => {
            const val = e.target.value;

            const date = new Date(val);

            const month = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });

            setForm({ ...form, month });
          }}
        />

        <input
          type="number"
          placeholder="Paid"
          className="border p-2"
          onChange={(e) =>
            setForm({
              ...form,
              paidAmount: Number(e.target.value),
            })
          }
        />

        <button className="bg-blue-500 text-white px-4">
          Save
        </button>
      </form>

      {!selectedTenant && <p>Select tenant first</p>}

      {selectedTenant && (
        <>
          <div className="bg-red-100 p-3 mb-4 rounded">
            Total Pending: ₹{totalPending}
          </div>

          <div className="grid gap-3">
            {sorted.map((p) => (
              <div
                key={p._id}
                className={`p-4 rounded text-white ${
                  p.status === "paid"
                    ? "bg-green-500"
                    : p.status === "partial"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                <p className="font-bold">{p.month}</p>
                <p>Paid: ₹{p.paidAmount}</p>
                <p>Remaining: ₹{p.remainingAmount}</p>
                <p>{p.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
