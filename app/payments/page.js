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
      alert("Saved ✅");
      loadData();
    }
  };

  // FILTER BY TENANT
  const filtered = payments.filter(
    (p) => p.tenant?._id === selectedTenant
  );

  // 🔥 FINAL SORT FIX (MONTH BASED)
  const sorted = filtered.sort((a, b) => {
    const parseMonth = (str) => {
      if (!str) return new Date(0);

      const [month, year] = str.split(" ");
      return new Date(`${month} 1, ${year}`);
    };

    return parseMonth(a.month) - parseMonth(b.month);
  });

  // TOTAL PENDING
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
        {/* TENANT SELECT */}
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

        {/* MONTH INPUT */}
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

        {/* PAID */}
        <input
          type="number"
          placeholder="Paid Amount"
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

      {!selectedTenant && (
        <p className="text-gray-500">
          👆 Select tenant to view payments
        </p>
      )}

      {selectedTenant && (
        <>
          {/* TOTAL */}
          <div className="bg-red-100 p-3 mb-4 rounded font-bold">
            Total Pending: ₹{totalPending}
          </div>

          {/* PAYMENTS LIST */}
          <div className="grid gap-3">
            {sorted.map((p) => (
              <div
                key={p._id}
                className={`p-4 rounded text-white shadow ${
                  p.status === "paid"
                    ? "bg-green-500"
                    : p.status === "partial"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                <p className="font-bold text-lg">
                  {p.month}
                </p>

                <p>Paid: ₹{p.paidAmount}</p>

                <p>Remaining: ₹{p.remainingAmount}</p>

                <p className="font-semibold">
                  Status: {p.status}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
