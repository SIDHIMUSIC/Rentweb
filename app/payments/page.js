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

  // ===============================
  // LOAD DATA
  // ===============================
  const loadData = async () => {
    try {
      const t = await fetch("/api/tenants").then((r) => r.json());
      const p = await fetch("/api/payments").then((r) => r.json());

      setTenants(Array.isArray(t) ? t : []);
      setPayments(Array.isArray(p) ? p : []);
    } catch (err) {
      console.log("Error loading:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===============================
  // SAVE PAYMENT (🔥 FIXED)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        isAdmin: true, // 🔥 MOST IMPORTANT FIX
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Saved ✅");
      loadData();
    } else {
      alert(data.message || "Error ❌");
    }
  };

  // ===============================
  // FILTER (FIXED)
  // ===============================
  const filtered = payments.filter(
    (p) => String(p.tenant?._id) === String(selectedTenant)
  );

  // ===============================
  // SORT
  // ===============================
  const sorted = [...filtered].sort((a, b) => {
    const parseMonth = (str) => {
      if (!str) return new Date(0);
      const [month, year] = str.split(" ");
      return new Date(`${month} 1, ${year}`);
    };
    return parseMonth(a.month) - parseMonth(b.month);
  });

  // ===============================
  // TOTAL
  // ===============================
  const totalPending = sorted.reduce(
    (a, x) => a + (x.remainingAmount || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        💳 Payments
      </h1>

      {/* ================= FORM ================= */}
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

        <input
          type="month"
          className="border p-2"
          onChange={(e) => {
            const date = new Date(e.target.value);
            const month = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            setForm({ ...form, month });
          }}
        />

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

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      {/* ================= EMPTY ================= */}
      {!selectedTenant && (
        <p className="text-gray-500">
          👆 Select tenant to view payments
        </p>
      )}

      {/* ================= LIST ================= */}
      {selectedTenant && (
        <>
          <div className="bg-red-100 p-3 mb-4 rounded font-bold">
            Total Pending: ₹{totalPending}
          </div>

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
                <div className="flex justify-between items-center">

                  {/* LEFT */}
                  <div>
                    <p className="font-bold text-lg">{p.month}</p>
                    <p>Paid: ₹{p.paidAmount}</p>
                    <p>Remaining: ₹{p.remainingAmount}</p>
                    <p>Status: {p.status}</p>
                  </div>

                  {/* RIGHT ✔ BUTTON */}
                  {p.status !== "paid" && (
                    <button
                      onClick={async () => {
                        await fetch("/api/payments/mark-paid", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: p._id,
                            isAdmin: true, // 🔥 FIX
                          }),
                        });

                        loadData();
                      }}
                      className="bg-white text-green-600 px-3 py-2 rounded shadow hover:scale-105"
                    >
                      ✔
                    </button>
                  )}

                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
