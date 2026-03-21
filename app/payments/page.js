"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: "",
    remainingAmount: "",
  });

  // ✅ LOAD TENANTS
  useEffect(() => {
    fetch("/api/tenants")
      .then((r) => r.json())
      .then((data) => setTenants(data))
      .catch(() => alert("Error loading tenants"));
  }, []);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tenant || !form.month) {
      alert("Fill all fields ⚠️");
      return;
    }

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        paidAmount: Number(form.paidAmount),
        remainingAmount: Number(form.remainingAmount),
      }),
    });

    if (res.ok) {
      alert("Payment Saved ✅");
      setForm({
        tenant: "",
        month: "",
        paidAmount: "",
        remainingAmount: "",
      });
    } else {
      alert("Error saving payment ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        💰 Payments
      </h1>

      {/* 🔥 FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4"
      >

        {/* TENANT */}
        <select
          value={form.tenant}
          className="border p-2 rounded w-48"
          onChange={(e) =>
            setForm({ ...form, tenant: e.target.value })
          }
        >
          <option value="">Select Tenant</option>

          {tenants.length === 0 && (
            <option disabled>No tenants found</option>
          )}

          {tenants.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.roomNumber})
            </option>
          ))}
        </select>

        {/* MONTH */}
        <input
          value={form.month}
          placeholder="Month (e.g. Jan)"
          className="border p-2 rounded w-40"
          onChange={(e) =>
            setForm({ ...form, month: e.target.value })
          }
        />

        {/* PAID */}
        <input
          value={form.paidAmount}
          placeholder="Paid ₹"
          type="number"
          className="border p-2 rounded w-32"
          onChange={(e) =>
            setForm({ ...form, paidAmount: e.target.value })
          }
        />

        {/* REMAINING */}
        <input
          value={form.remainingAmount}
          placeholder="Remaining ₹"
          type="number"
          className="border p-2 rounded w-32"
          onChange={(e) =>
            setForm({ ...form, remainingAmount: e.target.value })
          }
        />

        {/* BUTTON */}
        <button className="bg-blue-500 text-white px-6 rounded hover:bg-blue-600 transition">
          Save
        </button>
      </form>

    </div>
  );
}
