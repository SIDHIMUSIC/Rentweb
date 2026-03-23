"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [openId, setOpenId] = useState(null);
  const [token, setToken] = useState(""); // 🔥 FIX

  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
  });

  // 🔐 TOKEN LOAD + PROTECT
  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.push("/login"); // 🔥 redirect
    } else {
      setToken(t); // 🔥 FIX
    }
  }, []);

  // LOAD DATA
  const loadData = async (tkn) => {
    try {
      const t = await fetch("/api/tenants", {
        headers: {
          Authorization: tkn,
        },
      }).then((r) => r.json());

      const p = await fetch("/api/payments", {
        headers: {
          Authorization: tkn,
        },
      }).then((r) => r.json());

      setTenants(Array.isArray(t) ? t : []);
      setPayments(Array.isArray(p) ? p : []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOAD AFTER TOKEN
  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tenant || !form.month || form.paidAmount <= 0) {
      alert("Fill all fields ❌");
      return;
    }

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Saved ✅");
      loadData(token);
    } else {
      alert(data.message || "Error ❌");
    }
  };

  // FILTER
  const filtered = payments.filter(
    (p) => String(p.tenant?._id) === String(selectedTenant)
  );

  // SORT
  const sorted = [...filtered].sort((a, b) => {
    const parseMonth = (str) => {
      if (!str) return new Date(0);
      const [month, year] = str.split(" ");
      return new Date(`${month} 1, ${year}`);
    };
    return parseMonth(a.month) - parseMonth(b.month);
  });

  // TOTAL
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

        <input
          type="month"
          className="border p-2"
          max={new Date().toISOString().slice(0, 7)}
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

      {!selectedTenant && (
        <p className="text-gray-500">👆 Select tenant</p>
      )}

      {selectedTenant && (
        <>
          <div className="bg-red-100 p-3 mb-4 rounded font-bold">
            Total Pending: ₹{totalPending}
          </div>

          <div className="grid gap-3">
            {sorted.map((p) => {
              const now = new Date();

              const parseMonth = (str) => {
                const [month, year] = str.split(" ");
                return new Date(`${month} 1, ${year}`);
              };

              const paymentDate = parseMonth(p.month);

              let bg = "bg-red-500";

              if (p.status === "paid") bg = "bg-green-500";
              else if (p.status === "partial") bg = "bg-yellow-500";

              if (
                p.remainingAmount > 0 &&
                paymentDate < now &&
                p.status !== "paid"
              ) {
                bg = "bg-red-700 animate-pulse";
              }

              return (
                <div
                  key={p._id}
                  onClick={() =>
                    setOpenId(openId === p._id ? null : p._id)
                  }
                  className={`p-4 rounded text-white shadow cursor-pointer ${bg}`}
                >
                  <div className="flex justify-between items-center">

                    {/* LEFT */}
                    <div>
                      <p className="font-bold text-lg">{p.month}</p>
                      <p>Paid: ₹{p.paidAmount}</p>
                      <p>Remaining: ₹{p.remainingAmount}</p>
                      <p>Status: {p.status}</p>

                      {openId === p._id && (
                        <div className="mt-3 bg-white text-black p-3 rounded">
                          <p><b>Total Rent:</b> ₹{p.totalRent}</p>
                          <p><b>Paid:</b> ₹{p.paidAmount}</p>
                          <p><b>Remaining:</b> ₹{p.remainingAmount}</p>
                          <p><b>Status:</b> {p.status}</p>
                        </div>
                      )}
                    </div>

                    {/* BUTTONS */}
                    <div
                      className="flex flex-col gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {p.status !== "paid" && (
                        <button
                          onClick={async () => {
                            await fetch("/api/payments/mark-paid", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: token,
                              },
                              body: JSON.stringify({ id: p._id }),
                            });
                            loadData(token);
                          }}
                          className="bg-white text-green-600 px-2 py-1 rounded"
                        >
                          ✔
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          const newAmount = prompt("Enter amount");
                          if (!newAmount || Number(newAmount) <= 0) return;

                          await fetch("/api/payments", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: token,
                            },
                            body: JSON.stringify({
                              tenant: p.tenant._id,
                              month: p.month,
                              paidAmount: Number(newAmount),
                            }),
                          });

                          loadData(token);
                        }}
                        className="bg-yellow-400 text-black px-2 py-1 rounded"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={async () => {
                          const ok = confirm("Delete?");
                          if (!ok) return;

                          await fetch("/api/payments/delete", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: token,
                            },
                            body: JSON.stringify({ id: p._id }),
                          });

                          loadData(token);
                        }}
                        className="bg-black text-white px-2 py-1 rounded"
                      >
                        ✖
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
