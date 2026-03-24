"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");
  const [token, setToken] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");

  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
  });

  // 🔐 AUTH
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      localStorage.setItem("redirect", "/payments");
      window.location.href = "/login";
    } else {
      setToken(t);
    }
  }, []);

  // LOAD DATA
  const loadData = async (tkn) => {
    const t = await fetch("/api/tenants", {
      headers: { Authorization: tkn },
    }).then((r) => r.json());

    const p = await fetch("/api/payments", {
      headers: { Authorization: tkn },
    }).then((r) => r.json());

    setTenants(Array.isArray(t) ? t : []);
    setPayments(Array.isArray(p) ? p : []);
  };

  useEffect(() => {
    if (token) loadData(token);
  }, [token]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleOnlinePayment = async (payment, amount) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const processPayment = async (mode) => {
    setPaymentMode(mode);
    setShowPaymentModal(false);

    const amount = prompt("Enter amount to pay");
    if (!amount || amount <= 0) return;

    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        amount: Number(amount),
        paymentId: selectedPayment._id,
        tenantName: selectedPayment.tenant.name,
        roomNumber: selectedPayment.tenant.roomNumber,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData.success) {
      alert("Failed to create order");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "HARRY RENT HOUSE",
      description: `Payment for ${selectedPayment.tenant.roomNumber}`,
      order_id: orderData.orderId,
      handler: async function (response) {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: selectedPayment._id,
            amount: Number(amount),
            paymentMode: mode,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert(`Payment Successful! Transaction ID: ${verifyData.transactionId}`);
          loadData(token);
        } else {
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: selectedPayment.tenant.name,
        contact: selectedPayment.tenant.phone || "",
      },
      theme: {
        color: "#3b82f6",
      },
      method: {
        upi: mode === "UPI",
        card: mode === "Card",
        netbanking: mode === "NetBanking",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // SAVE PAYMENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tenant || form.paidAmount <= 0) {
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

  const totalPending = sorted.reduce(
    (a, x) => a + (x.remainingAmount || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        Payments
      </h1>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Select Payment Method
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => processPayment("UPI")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition"
              >
                <span className="text-2xl">📱</span>
                <span>Pay via UPI</span>
              </button>

              <button
                onClick={() => processPayment("Card")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition"
              >
                <span className="text-2xl">💳</span>
                <span>Pay via Debit/Credit Card</span>
              </button>

              <button
                onClick={() => processPayment("NetBanking")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition"
              >
                <span className="text-2xl">🏦</span>
                <span>Pay via Net Banking</span>
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              let bg = "bg-red-500";
              if (p.status === "paid") bg = "bg-green-500";
              else if (p.status === "partial") bg = "bg-yellow-500";

              return (
                <div
                  key={p._id}
                  className={`p-4 rounded text-white flex justify-between items-center ${bg}`}
                >
                  {/* LEFT */}
                  <div>
                    <p className="font-bold">{p.month}</p>
                    <p>Remaining: ₹{p.remainingAmount}</p>
                  </div>

                  {/* RIGHT BUTTONS */}
                  <div className="flex gap-2">

                    {/* PAY NOW */}
                    {p.status !== "paid" && (
                      <button
                        onClick={() => handleOnlinePayment(p)}
                        className="bg-green-600 text-white px-3 py-1 rounded font-bold"
                      >
                        Pay Now
                      </button>
                    )}

                    {/* ✔ */}
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

                    {/* ✏️ */}
                    <button
                      onClick={async () => {
                        const amt = prompt("Enter amount");
                        if (!amt) return;

                        await fetch("/api/payments", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                          },
                          body: JSON.stringify({
                            tenant: p.tenant._id,
                            paidAmount: Number(amt),
                          }),
                        });

                        loadData(token);
                      }}
                      className="bg-yellow-400 text-black px-2 py-1 rounded"
                    >
                      ✏️
                    </button>

                    {/* 🧾 RECEIPT */}
                    <button
                      onClick={() => {
                        const html = `
                        <html>
                        <body style="font-family:Arial;padding:20px">
                          <div style="border:2px solid black;padding:20px;width:350px;margin:auto">
                            
                            <h2 style="text-align:center;color:cyan">
                              HARRY RENT HOUSE
                            </h2>

                            <p style="text-align:center">
                              Bihar Sharif, 803216
                            </p>

                            <hr/>

                            <p>Tenant: ${p.tenant?.name}</p>
                            <p>Room: ${p.tenant?.roomNumber}</p>
                            <p>Month: ${p.month}</p>

                            <hr/>

                            <p>Total: ₹${p.totalRent}</p>
                            <p>Paid: ₹${p.paidAmount}</p>
                            <p>Remaining: ₹${p.remainingAmount}</p>

                            <hr/>

                            <p style="text-align:right">Sign ✍️</p>

                          </div>
                        </body>
                        </html>
                        `;

                        const win = window.open("", "", "width=400,height=600");
                        win.document.write(html);
                        win.document.close();
                        win.print();
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      🧾
                    </button>

                    {/* ❌ */}
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
                      ❌
                    </button>

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
